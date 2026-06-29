# 👥 Discord Friend Manager

Node.js CLI tool to view, search, and manage your Discord friends list.  
Zero npm dependencies — runs on Node.js v18+ out of the box.

---

## ⚠️ Disclaimer

- This tool uses your **user token**, which violates [Discord's Terms of Service](https://discord.com/terms).
- Using user tokens in automated scripts can result in **account suspension or ban**.
- Your token provides **full account access** — only run code you trust on your own machine.
- This is for personal/educational use only. The author is not responsible for any consequences.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Token Verification | Validates your token before doing anything |
| 👥 View Friends | Lists all friends with username and ID |
| 🔍 Search | Filter friends by username |
| ❌ Remove Friend | Remove a single friend by list number |
| 💥 Remove All | Bulk remove all friends with configurable cooldown |
| 📨 Pending Requests | View incoming & outgoing friend requests |
| 🛡️ Rate Limit Handling | Automatically waits on 429 responses |

---

## 🚀 Usage

```bash
node index.js
```

That's it. No `npm install` needed.

---

## 🔑 How to Get Your Token

**Option A — Browser DevTools:**
1. Open Discord in your browser (discord.com/app)
2. Press `F12` → go to the **Network** tab
3. Send any message in any channel
4. Find the `messages` request → Headers → `Authorization`
5. Copy that value — that's your token

**Option B — Local Storage:**
1. Open Discord in browser → `F12`
2. Go to **Application** tab → Local Storage → `https://discord.com`
3. Find the `token` key

> ⚠️ **Never share your token with anyone or any website you don't trust.**

---

## 📋 Menu Options

```
[1]  👥  View Friends List     — see all your friends
[2]  🔍  Search Friend         — filter by username
[3]  ❌  Remove a Friend       — remove one by number
[4]  💥  Remove ALL Friends    — bulk remove with cooldown
[5]  📨  Pending Requests      — view incoming/outgoing
[6]  🚪  Exit
```

---

## ⚙️ Cooldown Settings

When using **Remove All** (option 4), you'll be asked for a cooldown value:

| Value | Risk Level |
|---|---|
| 500ms | Higher risk of rate limit |
| 1500ms (default) | Recommended |
| 3000ms+ | Safest, slower |

The tool automatically handles `429 Too Many Requests` by pausing and retrying.

---

## 🔧 Requirements

- **Node.js v18+** (uses built-in `https` and `readline`)
- Windows / Linux / macOS
- Internet connection

---

## 📁 File Structure

```
discord-friend-manager/
└── index.js     ← main script (everything in one file)
```
