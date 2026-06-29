# Discord Friend Manager v1.2.0  
# مدير أصدقاء ديسكورد – أداة CLI

> Unofficial tool for managing Discord friends, DMs, servers & messages.  
> أداة غير رسمية لإدارة الأصدقاء والمحادثات والسيرفرات والرسائل في Discord.

---

## ⚠️ English Warning

**This tool uses your Discord user token and violates Discord’s Terms of Service.**  
By using it you accept **full responsibility** for any consequences, including account bans or loss.  

- Never share your token.
- This tool is for **personal account management only**.
- Malicious use (token theft, spying, etc.) is **strictly prohibited**.
- The developer is **not liable** for any damage or misuse.

---

## ⚠️ تحذير عربي

**هذه الأداة تستخدم توكن حسابك الشخصي، وتُعتبر مخالفة لشروط خدمة Discord.**  
أنت تتحمل **كامل المسؤولية** عن أي نتائج، بما في ذلك الحظر أو فقدان الحساب.

- لا تشارك التوكن مع أي شخص.
- الأداة مخصصة **لإدارة حسابك الشخصي فقط**.
- يُمنع منعاً باتاً استخدامها لأغراض خبيثة (سرقة حسابات، تجسس…إلخ).
- المطور **غير مسؤول** عن أي سوء استخدام أو ضرر.

---

## ©️ Rights – الحقوق

**All rights reserved © the original developer.**  
You may use the tool as-is for personal, non‑commercial purposes.  
Redistribution, modification, or sale without explicit written permission is prohibited.

**جميع الحقوق محفوظة للمطور الأصلي ©.**  
يُسمح باستخدام الأداة كما هي للاستخدام الشخصي فقط.  
لا يجوز إعادة توزيعها أو تعديلها أو بيعها دون إذن خطي.

---

## ✨ Features – الميزات

| # | English                       | العربية                            |
|---|-------------------------------|------------------------------------|
| 1 | 👥 View all friends           | 👥 عرض جميع الأصدقاء              |
| 2 | 🔍 Search for a friend        | 🔍 البحث عن صديق بالاسم           |
| 3 | ❌ Remove a single friend     | ❌ حذف صديق واحد                  |
| 4 | 💥 Remove ALL friends (bulk)  | 💥 حذف جميع الأصدقاء (دفعة واحدة) |
| 5 | 📨 View pending requests      | 📨 عرض طلبات الصداقة المعلقة      |
| 6 | 💬 Close ALL DM conversations | 💬 إغلاق كل المحادثات الخاصة (DM) |
| 7 | 🚫 Leave ALL servers          | 🚫 مغادرة جميع السيرفرات          |
| 8 | 🗑️ Delete all YOUR messages in a DM | 🗑️ حذف كل رسائلك في محادثة مع مستخدم |

---

## 📦 Requirements – المتطلبات

- **Node.js** v18 or higher (no external packages)  
  **Node.js** إصدار 18 أو أحدث (بدون حزم خارجية)

---

## 🚀 Usage – طريقة الاستخدام

1. Get your user token (instructions appear when you run the tool).  
   احصل على توكن حسابك (التعليمات تظهر عند تشغيل الأداة).
2. Run in terminal / شغّل في الطرفية:
   ```bash
   node index.js
   ```
3. Follow the interactive menu.  
   اتبع القائمة التفاعلية.

---

## 🔐 Optional Protection – حماية اختيارية

To create a tamper‑resistant executable:  
لإنشاء ملف تنفيذي يصعب تعديله:

```bash
# Obfuscate code (تشويش الكود)
javascript-obfuscator index.js --output obfuscated.js

# Compile to exe (تحويل لملف تنفيذي)
pkg obfuscated.js --targets node18-win-x64 --output DiscordTool.exe
```

**Note:** 100% security is impossible; skilled reverse engineers can still inspect the binary.  
**ملاحظة:** الحماية 100% مستحيلة، لكن هذا يصعّب العملية كثيراً.

---

## 🛡️ Privacy – الخصوصية

- **No data is collected or sent anywhere.** All operations are local.  
  **لا يتم جمع أو إرسال أي بيانات لأي جهة.** كل العمليات محلية بالكامل.
- Token is used only to authenticate with Discord’s official API.  
  التوكن يُستخدم فقط للمصادقة مع خوادم Discord الرسمية.
- No telemetry, no analytics, no external servers.  
  لا توجد إحصائيات أو خوادم خارجية.

---

## ❓ FAQ – الأسئلة الشائعة

**Is this legal?**  
No, it violates Discord’s ToS. Use at your own risk.

**هل هذا قانوني؟**  
لا، الأداة تخالف شروط ديسكورد. استخدمها على مسؤوليتك.

**What if my token is leaked?**  
The developer is not responsible. Never share your token.

**ماذا لو تسرب التوكن الخاص بي؟**  
المطور غير مسؤول. لا تشارك توكنك مع أحد.

**Can I modify the code?**  
The source is provided for educational review. Any harmful modification is forbidden.

**هل يمكنني تعديل الكود؟**  
الكود متاح للتعلم فقط. يُمنع تعديله لأغراض ضارة.

---

## 📜 License – الترخيص

**All rights reserved. This software is provided “AS IS”, without warranty of any kind.**  
By using it you agree to all the above terms.

**جميع الحقوق محفوظة. البرنامج مقدم “كما هو” بدون أي ضمانات.**  
باستخدامك لهذا البرنامج، أنت توافق على جميع الشروط المذكورة أعلاه.

---

*Made with caution 🖤 | صُنع بحذر*
