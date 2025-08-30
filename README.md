## 🖥️ How to Run the Instruktionssystem Locally (Windows)

This guide explains how to launch the app on a Windows computer with minimal setup — no coding tools required.

---

### ✅ 1. Requirements (only needed once)

- [✔️] **Node.js 20+ LTS** installed  
  → Download from: https://nodejs.org  
  → During install, make sure "npm package manager" is selected

---

### 📂 2. Project Folder Setup

- Copy or clone the full `instruktionssystem` folder to the computer  
  This folder should contain:
  - `instruktion.bat` ✅
  - `package.json` ✅
  - `backend/` folder ✅
  - `.env` file (if needed) ✅

---

### 📦 3. First-Time Dependency Install

**Only needs to be done once.**

Open **Command Prompt** and run:

```bat
cd path\to\instruktionssystem
npm install
cd backend
npm install
cd ..