#!/usr/bin/env node
/**
 * ╔════════════════════════════════════════════╗
 * ║     Discord Friend Manager  v1.0.2         ║
 * ║     Node.js CLI — Zero dependencies        ║
 * ╚════════════════════════════════════════════╝
 *
 * ⚠️  UNOFFICIAL TOOL — Uses Discord user token.
 *    This violates Discord ToS. Use at your own risk.
 *    Your token grants FULL account access — never
 *    share it or run untrusted scripts with it.
 *
 * REQUIREMENTS: Node.js v18+ (no npm install needed)
 * RUN:  node index.js
 */

'use strict';

const https    = require('https');
const readline = require('readline');

// ─── Color Palette (ANSI) ──────────────────────────────────────
const C = {
  r      : '\x1b[0m',
  bold   : '\x1b[1m',
  dim    : '\x1b[2m',
  blue   : '\x1b[38;5;99m',
  cyan   : '\x1b[38;5;117m',
  green  : '\x1b[38;5;83m',
  red    : '\x1b[38;5;203m',
  yellow : '\x1b[38;5;220m',
  white  : '\x1b[97m',
  gray   : '\x1b[90m',
  lgray  : '\x1b[37m',
};

const cls   = () => process.stdout.write('\x1b[2J\x1b[0;0H');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ask   = (rl, q) => new Promise(res => rl.question(q, res));
const hr    = (n = 50) => `${C.gray}${'─'.repeat(n)}${C.r}`;

// ─── Banner ─────────────────────────────────────────────────────
function banner() {
  console.log(`
${C.blue}${C.bold}  ██████╗ ███████╗███╗   ███╗
  ██╔══██╗██╔════╝████╗ ████║
  ██║  ██║█████╗  ██╔████╔██║
  ██║  ██║██╔══╝  ██║╚██╔╝██║
  ██████╔╝██║     ██║ ╚═╝ ██║
  ╚═════╝ ╚═╝     ╚═╝     ╚═╝${C.r}
${C.white}${C.bold}  Discord Friend Manager ${C.gray}v1.0.2${C.r}
${C.yellow}  ⚠  Unofficial — may violate Discord ToS${C.r}
`);
}

// ─── API Wrapper (Fixed) ────────────────────────────────────────
function apiCall(method, path, token, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;

    // Remove any existing "Bearer " prefix – we’ll use the raw token
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    const headers = {
      'Authorization'      : cleanToken,
      'User-Agent'         : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'X-Super-Properties' : Buffer.from(JSON.stringify({
        os:'Windows', browser:'Chrome', device:'',
        system_locale:'en-US',
        browser_user_agent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        browser_version:'126.0.0.0', os_version:'10',
        referrer:'', referring_domain:'',
        referrer_current:'', referring_domain_current:'',
        release_channel:'stable', client_build_number:367562, client_event_source:null,
      })).toString('base64'),
      'X-Discord-Locale'   : 'en-US',
    };

    // Only set Content-Type / Origin / Referer when there is a body
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Origin']       = 'https://discord.com';
      headers['Referer']      = 'https://discord.com/channels/@me';
    }

    const req = https.request({
      hostname : 'discord.com',
      path     : `/api/v9${path}`,
      method,
      headers,
    }, (res) => {
      let buf = '';
      res.on('data', chunk => { buf += chunk; });
      res.on('end', () => {
        try {
          const data = buf ? JSON.parse(buf) : null;
          if (res.statusCode >= 400 && data?.message) {
            console.log(`  ${C.red}API Error (${res.statusCode}): ${data.message}${C.r}`);
          }
          resolve({ status: res.statusCode, data });
        } catch {
          resolve({ status: res.statusCode, data: null });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Discord Helpers ────────────────────────────────────────────
const verifyToken = async (t) => {
  const { status, data } = await apiCall('GET', '/users/@me', t);
  if (status !== 200) return null;
  if (data?.bot) return { __isBot: true, username: data.username };
  return data;
};

const getFriends = async (t) => {
  const { status, data } = await apiCall('GET', '/users/@me/relationships', t);
  if (status === 401) { console.log(`\n  ${C.red}✗ Unauthorized — token may have expired.${C.r}`); return []; }
  if (status !== 200) { console.log(`\n  ${C.red}✗ API error: HTTP ${status}${C.r}`); return []; }
  const all = data || [];
  const friends = all.filter(r => r.type === 1);
  if (all.length > 0 && friends.length === 0) {
    const types = all.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});
    console.log(`\n  ${C.yellow}ℹ  Found ${all.length} relationships but 0 friends.${C.r}`);
    console.log(`  ${C.gray}Breakdown → type 2 (blocked): ${types[2]||0}, type 3 (incoming): ${types[3]||0}, type 4 (outgoing): ${types[4]||0}${C.r}`);
  }
  return friends;
};

const getPending = async (t) => {
  const { status, data } = await apiCall('GET', '/users/@me/relationships', t);
  if (status !== 200) return { incoming: [], outgoing: [] };
  const rels = data || [];
  return {
    incoming : rels.filter(r => r.type === 3),
    outgoing : rels.filter(r => r.type === 4),
  };
};

const removeFriend = async (t, id) => {
  const { status, data } = await apiCall('DELETE', `/users/@me/relationships/${id}`, t);
  if (status === 429 && data?.retry_after) return { ok: false, retryAfter: data.retry_after * 1000 };
  return { ok: status === 204, retryAfter: 0 };
};

// ─── Formatting ─────────────────────────────────────────────────
function userTag(user) {
  if (!user) return 'Unknown';
  return (user.discriminator && user.discriminator !== '0')
    ? `${user.username}#${user.discriminator}`
    : `@${user.username}`;
}

function showList(friends, filter = '') {
  const list = filter
    ? friends.filter(f => userTag(f.user).toLowerCase().includes(filter.toLowerCase()))
    : friends;

  console.log(`\n  ${hr(50)}`);
  console.log(`  ${C.bold}${C.white} 👥 Friends ${C.r}${C.gray}[${list.length}/${friends.length}]${C.r}`);
  console.log(`  ${hr(50)}`);

  if (!list.length) {
    console.log(`\n  ${C.gray}  (no results)${C.r}\n`);
  } else {
    list.forEach((f, i) => {
      const idx   = String(i + 1).padStart(3);
      const name  = userTag(f.user);
      const uid   = f.user.id;
      const bot   = f.user.bot ? ` ${C.yellow}[BOT]${C.r}` : '';
      console.log(`  ${C.gray}${idx}.${C.r}  ${C.white}${C.bold}${name}${C.r}${bot}  ${C.gray}${uid}${C.r}`);
    });
  }

  console.log(`  ${hr(50)}`);
  return list;
}

// ─── Actions ────────────────────────────────────────────────────
async function actionViewFriends(rl, token) {
  console.log(`\n  ${C.cyan}Fetching friends list...${C.r}`);
  const friends = await getFriends(token);
  showList(friends);
  await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
}

async function actionSearchFriend(rl, token) {
  const query = (await ask(rl, `  ${C.blue}Search by username: ${C.r}`)).trim();
  if (!query) return;
  const friends = await getFriends(token);
  showList(friends, query);
  await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
}

async function actionRemoveSingle(rl, token) {
  console.log(`\n  ${C.cyan}Fetching friends list...${C.r}`);
  const friends = await getFriends(token);
  const list = showList(friends);

  if (!list.length) {
    await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
    return;
  }

  const raw = await ask(rl, `\n  ${C.yellow}Enter # to remove (0 = cancel): ${C.r}`);
  const n   = parseInt(raw);

  if (!n || isNaN(n) || n > list.length) {
    console.log(`  ${C.gray}Cancelled.${C.r}`);
    await sleep(800);
    return;
  }

  const target = list[n - 1];
  const name   = userTag(target.user);

  const conf = (await ask(rl, `  ${C.red}Remove ${C.bold}${name}${C.r}${C.red}? (y/N): ${C.r}`)).toLowerCase();

  if (conf !== 'y') {
    console.log(`  ${C.gray}Cancelled.${C.r}`);
    await sleep(800);
    return;
  }

  process.stdout.write(`  Removing... `);
  const { ok } = await removeFriend(token, target.user.id);
  console.log(ok ? `${C.green}✓ Removed ${name}!${C.r}` : `${C.red}✗ Failed. Try again later.${C.r}`);
  await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
}

async function actionRemoveAll(rl, token) {
  console.log(`\n  ${C.cyan}Fetching friends list...${C.r}`);
  const friends = await getFriends(token);

  if (!friends.length) {
    console.log(`  ${C.gray}No friends to remove.${C.r}`);
    await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
    return;
  }

  console.log(`\n  ${C.yellow}⚠  You have ${C.bold}${friends.length}${C.r}${C.yellow} friends.${C.r}`);
  console.log(`  ${C.gray}All will be removed with a cooldown between each.${C.r}`);
  console.log(`  ${C.gray}Tip: Higher cooldown = lower ban risk.${C.r}`);

  const conf = (await ask(rl, `\n  ${C.red}Type "${C.bold}YES${C.r}${C.red}" to confirm: ${C.r}`)).trim();
  if (conf !== 'YES') {
    console.log(`  ${C.gray}Cancelled.${C.r}`);
    await sleep(800);
    return;
  }

  const rawDelay = await ask(rl, `  ${C.blue}Cooldown between each removal (ms) [default 1500]: ${C.r}`);
  const delay    = Math.max(500, parseInt(rawDelay) || 1500);

  let removed = 0;
  let failed  = 0;
  console.log();

  for (let i = 0; i < friends.length; i++) {
    const f    = friends[i];
    const name = userTag(f.user);
    const pct  = `${i + 1}/${friends.length}`;

    process.stdout.write(`  ${C.gray}[${pct}]${C.r} ${C.lgray}${name}${C.r} ... `);

    const { ok, retryAfter } = await removeFriend(token, f.user.id);

    if (ok) {
      console.log(`${C.green}✓${C.r}`);
      removed++;
      if (i < friends.length - 1) await sleep(delay);
    } else {
      console.log(`${C.red}✗${C.r}`);
      failed++;
      const wait = retryAfter || delay * 3;
      if (i < friends.length - 1) {
        process.stdout.write(`  ${C.yellow}Rate limited — waiting ${(wait / 1000).toFixed(1)}s...${C.r}\r`);
        await sleep(wait);
        process.stdout.write(' '.repeat(60) + '\r');
      }
    }
  }

  console.log(`\n  ${hr(50)}`);
  console.log(`  ${C.green}✓ Removed: ${removed}${C.r}   ${C.red}✗ Failed: ${failed}${C.r}`);
  console.log(`  ${hr(50)}`);
  await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
}

async function actionPendingRequests(rl, token) {
  console.log(`\n  ${C.cyan}Fetching pending requests...${C.r}`);
  const { incoming, outgoing } = await getPending(token);

  console.log(`\n  ${hr(50)}`);
  console.log(`  ${C.bold}${C.white} 📨 Incoming Requests ${C.r}${C.gray}[${incoming.length}]${C.r}`);
  console.log(`  ${hr(50)}`);
  if (!incoming.length) {
    console.log(`  ${C.gray}  (none)${C.r}`);
  } else {
    incoming.forEach((r, i) => {
      console.log(`  ${C.gray}${String(i + 1).padStart(3)}.${C.r}  ${C.white}${C.bold}${userTag(r.user)}${C.r}  ${C.gray}${r.user.id}${C.r}`);
    });
  }

  console.log(`\n  ${hr(50)}`);
  console.log(`  ${C.bold}${C.white} 📤 Outgoing Requests ${C.r}${C.gray}[${outgoing.length}]${C.r}`);
  console.log(`  ${hr(50)}`);
  if (!outgoing.length) {
    console.log(`  ${C.gray}  (none)${C.r}`);
  } else {
    outgoing.forEach((r, i) => {
      console.log(`  ${C.gray}${String(i + 1).padStart(3)}.${C.r}  ${C.white}${C.bold}${userTag(r.user)}${C.r}  ${C.gray}${r.user.id}${C.r}`);
    });
  }
  console.log(`  ${hr(50)}`);

  await ask(rl, `\n  ${C.gray}Press ENTER to go back...${C.r}`);
}

// ─── Main Menu ───────────────────────────────────────────────────
async function mainMenu(rl, token, user) {
  while (true) {
    cls();
    banner();

    console.log(`  ${C.green}● ${C.bold}${userTag(user)}${C.r}  ${C.gray}${user.id}${C.r}\n`);
    console.log(`  ${hr(40)}`);
    console.log(`  ${C.blue}[1]${C.r}  👥  View Friends List`);
    console.log(`  ${C.blue}[2]${C.r}  🔍  Search Friend`);
    console.log(`  ${C.blue}[3]${C.r}  ❌  Remove a Friend`);
    console.log(`  ${C.blue}[4]${C.r}  💥  Remove ALL Friends`);
    console.log(`  ${C.blue}[5]${C.r}  📨  Pending Requests`);
    console.log(`  ${C.red}[6]${C.r}  🚪  Exit`);
    console.log(`  ${hr(40)}`);
    console.log();

    const choice = (await ask(rl, `  ${C.blue}→ ${C.r}`)).trim();
    console.log();

    switch (choice) {
      case '1': {
        cls(); banner();
        await actionViewFriends(rl, token);
        break;
      }
      case '2': {
        cls(); banner();
        await actionSearchFriend(rl, token);
        break;
      }
      case '3': {
        cls(); banner();
        await actionRemoveSingle(rl, token);
        break;
      }
      case '4': {
        cls(); banner();
        await actionRemoveAll(rl, token);
        break;
      }
      case '5': {
        cls(); banner();
        await actionPendingRequests(rl, token);
        break;
      }
      case '6': {
        cls();
        console.log(`\n  ${C.blue}Goodbye! 👋${C.r}\n`);
        rl.close();
        process.exit(0);
      }
    }
  }
}

// ─── Entry Point ─────────────────────────────────────────────────
(async () => {
  const rl = readline.createInterface({
    input  : process.stdin,
    output : process.stdout,
  });

  cls();
  banner();

  console.log(`  ${C.gray}Paste your Discord user token to get started.${C.r}`);
  console.log(`  ${C.yellow}⚠  Your token = full account access. Never share it!${C.r}\n`);
  console.log(`  ${C.gray}How to get your token:${C.r}`);
  console.log(`  ${C.gray}  1. Open Discord in browser → F12 → Network tab${C.r}`);
  console.log(`  ${C.gray}  2. Send any message → find request → Authorization header${C.r}`);
  console.log(`  ${C.gray}  OR: Application tab → Local Storage → token${C.r}\n`);

  let token, user;

  for (;;) {
    token = (await ask(rl, `  ${C.blue}Token: ${C.r}`)).trim();
    if (!token) continue;

    process.stdout.write(`\n  ${C.cyan}Verifying token...${C.r} `);

    try {
      user = await verifyToken(token);
    } catch (e) {
      console.log(`${C.red}✗ Network error: ${e.message}${C.r}\n`);
      continue;
    }

    if (user) {
      if (user.__isBot) {
        console.log(`${C.red}✗ Bot Token detected!${C.r}`);
        console.log(`  ${C.yellow}Bot tokens can't access friend lists.${C.r}`);
        console.log(`  ${C.gray}You need a USER token, not a bot token.${C.r}\n`);
        user = null;
        continue;
      }
      console.log(`${C.green}✓${C.r}`);
      break;
    }

    console.log(`${C.red}✗ Invalid token. Please try again.${C.r}\n`);
  }

  console.log(`\n  ${C.green}Logged in as ${C.bold}${userTag(user)}${C.r}\n`);
  await sleep(800);

  await mainMenu(rl, token, user);
})().catch(err => {
  console.error(`\n${C.red}Fatal error: ${err.message}${C.r}`);
  process.exit(1);
});
