# 🛡️ Heuristic Engine

The **Heuristic Engine** is a TypeScript-based backend service that detects **phishing indicators** across multiple channels:  
- 🌐 **URLs** (malicious links, suspicious TLDs, homoglyph attacks, etc.)  
- 📧 **Emails** (.eml parsing, spoofing, suspicious attachments, auth fails)  
- 📱 **QR Codes** (malicious QR destinations)  

It uses a **rules-based scoring system** (defined in `config/rules.json`) and returns:  
- ✅ A **risk score** (0–100)  
- 📋 The **reasons** why a resource was flagged  
- 🏷️ A **verdict** (`Benign`, `Suspicious`, `Phishing`)

---

## 📦 Tech Stack
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [tldts](https://www.npmjs.com/package/tldts) for domain parsing  
- [mailparser](https://nodemailer.com/extras/mailparser/) for `.eml` files  
- [jsQR](https://github.com/cozmo/jsQR) + [node-canvas](https://github.com/Automattic/node-canvas) for QR codes  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-org/heuristic-engine.git
cd heuristic-engine
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment
Copy the example env:
```bash
cp .env.example .env
```
Update values as needed (ports, logging, etc.).

### 4️⃣ Start the Service
Development:
```bash
npm run dev
```

Build + Production:
```bash
npm run build
npm run start
```

---

## 📖 Usage

### 🔹 URL Analysis
**Endpoint:** `POST /analyze-url`  
**Body:**
```json
{ "url": "http://login-bank.xyz/secure" }
```
**Response:**
```json
{
  "url": "http://login-bank.xyz/secure",
  "domain": "bank.xyz",
  "riskScore": 85,
  "reasons": [
    "Uses insecure HTTP protocol",
    "Suspicious subdomain keywords (login, secure, account, verify)",
    "Suspicious top-level domain (e.g., .ru, .cn, .xyz, .tk)"
  ],
  "verdict": "Phishing"
}
```

---

### 🔹 QR Code Analysis
**Endpoint:** `POST /analyze-qr`  
- Upload a QR code image as `file` via form-data.  
- Service extracts embedded URL and passes it through the URL analyzer.  

---

### 🔹 Email Analysis
**Endpoint:** `POST /analyze-email`  
- Upload a `.eml` file as `email` via form-data.  
- Parser extracts headers, body, URLs, attachments, and authentication checks.  

**Response:**
```json
{
  "subject": "Urgent: Verify your account",
  "from": "support@fakebank.com",
  "replyTo": "hacker@evil.com",
  "urls": ["http://fakebank-login.xyz"],
  "attachments": ["invoice.exe"],
  "authFailed": true,
  "riskScore": 92,
  "reasons": [
    "Urgent or threatening language",
    "Sender display name spoofing",
    "Executable attachment detected (.exe, .js, .scr)",
    "SPF/DKIM/DMARC authentication failed"
  ],
  "verdict": "Phishing"
}
```

---

## 🛠️ Developer Guide

### Add / Modify Rules
Rules live in `config/rules.json`.  
Example:
```json
"url": {
  "http_instead_https": {
    "score": 10,
    "severity": "low",
    "message": "Uses insecure HTTP protocol"
  }
}
```

- **score** → numeric contribution to risk  
- **severity** → (`low`, `medium`, `high`, `critical`)  
- **message** → human-readable explanation  

Update rules and restart the service.

---

### Folder Structure
```
src/
 ├─ routes/           # Express routers (url, email, qr)
 ├─ services/         # Analyzer services
 ├─ utils/            # Helpers (parser, rule applier, error handler)
 ├─ config/           # rules.json & environment
 ├─ types/            # TypeScript types
 └─ middlewares/      # error handling, async wrapper
```

---

## 👩‍💻 Contributing
1. Create a new branch:
   ```bash
   git checkout -b feat/new-check
   ```
2. Add new rules or services.  
3. Run tests:
   ```bash
   npm test
   ```
4. Submit a PR.

---

## 📜 License
MIT License © 2025 Heuristic Engine Dev Team
