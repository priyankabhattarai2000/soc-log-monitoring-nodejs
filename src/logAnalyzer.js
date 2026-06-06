 const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "../logs/auth_logs.txt");
const OUTPUT_FILE = path.join(__dirname, "../output/alerts_report.txt");

const FAILED_THRESHOLD = 3;

function parseLogs(filePath) {
    const data = fs.readFileSync(filePath, "utf-8");
    return data.split("\n").filter(line => line.trim() !== "");
}

function analyzeLogs(logs) {
    const failedAttempts = {};
    const alerts = [];

    logs.forEach(log => {
        const parts = log.split(" ");

        const timestamp = parts[0] + " " + parts[1];
        const status = parts[2];

        const user = parts[3].split("=")[1];
        const ip = parts[4].split("=")[1];

        if (status === "LOGIN_FAILED") {
            failedAttempts[ip] = (failedAttempts[ip] || 0) + 1;

            if (failedAttempts[ip] >= FAILED_THRESHOLD) {
                alerts.push({
                    type: "BRUTE_FORCE",
                    ip,
                    user,
                    attempts: failedAttempts[ip],
                    time: timestamp,
                    severity: "HIGH"
                });
            }
        }

        if (status === "LOGIN_SUCCESS") {
            failedAttempts[ip] = 0;
        }
    });

    return alerts;
}

function generateReport(alerts) {
    const fs = require("fs");

    if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    }

    let report = "";

    if (alerts.length === 0) {
        report = "No threats detected.\n";
    } else {
        report += "SOC ALERT REPORT\n";
        report += "=====================\n\n";

        alerts.forEach(alert => {
            report += `TYPE: ${alert.type}\n`;
            report += `IP: ${alert.ip}\n`;
            report += `User: ${alert.user}\n`;
            report += `Attempts: ${alert.attempts}\n`;
            report += `Severity: ${alert.severity}\n`;
            report += `Detected At: ${alert.time}\n`;
            report += "---------------------\n";
        });
    }

    fs.writeFileSync(OUTPUT_FILE, report);
    console.log("Report generated at:", OUTPUT_FILE);
}

const logs = parseLogs(LOG_FILE);
const alerts = analyzeLogs(logs);
generateReport(alerts);