# SOC Log Monitoring System (Node.js)

## 🔐 Overview
This project simulates a basic Security Operations Center (SOC) log monitoring system using Node.js. It analyzes authentication logs and detects potential brute-force login attempts.

---

## ⚙️ Features
- Parses authentication logs
- Detects multiple failed login attempts
- Flags brute-force attacks
- Generates SOC alert reports automatically

---

## 🧠 How It Works
- Reads logs from `/logs/auth_logs.txt`
- Tracks failed login attempts per IP
- If failures ≥ 3 → triggers alert
- Generates report in `/output/alerts_report.txt`

---

## 🛠️ Tech Stack
- Node.js
- File System (fs module)
- JavaScript

---

## 📂 Project Structure
logs/ → input log files  
src/ → log analysis code  
output/ → generated SOC reports  

---

## 🚀 How to Run

```bash
node src/logAnalyzer.js
