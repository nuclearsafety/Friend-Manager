# Discord Friend Manager

> **Unofficial CLI tool** for managing your Discord account: friends, DMs, servers, and messages.  
> Built with zero dependencies – just Node.js.

---

## ⚠️  Important Warning

This tool uses your **Discord user token** to interact with the official Discord API.  
**This violates Discord’s Terms of Service.** Your token grants full access to your account:

- Never share your token with anyone.
- Use this tool **at your own risk**.
- The developer is **not responsible** for any bans, account losses, or other consequences.

---

## ✨ Features

| #  | Action                                            |
|----|---------------------------------------------------|
| 1  | 📋  **View all friends**                           |
| 2  | 🔍  **Search for a friend** by username            |
| 3  | ❌  **Remove a single friend**                     |
| 4  | 💥  **Remove ALL friends** (bulk, with cooldown)   |
| 5  | 📨  **View pending friend requests**               |
| 6  | 💬  **Close ALL DM conversations**                 |
| 7  | 🚫  **Leave ALL servers**                          |
| 8  | 🗑️  **Delete all YOUR messages** in a DM by user ID |

All bulk actions include a **confirmation step**, a configurable **cooldown** between operations, and handle **rate limits** (`429 Too Many Requests`) automatically.

---

## 📦 Requirements

- **Node.js** v18 or higher (no `npm install` needed)

---

## 🚀 Quick Start

1. **Clone or download** the script (`index.js`).
2. **Get your Discord user token**:
   - Open Discord in your browser (Chrome/Firefox).
   - Press `F12` → go to the **Network** tab.
   - Refresh (`Ctrl+R`) and filter by `api`.
   - Click any API request (like `users/@me`), look at **Request Headers**, and copy the `Authorization` value.
   - Remove the `Bearer ` prefix if present – keep only the long token.
3. **Run the tool**:

```bash
node index.js
