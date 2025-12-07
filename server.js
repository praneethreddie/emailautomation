const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const cron = require("node-cron");

const app = express();

// Increase payload limit for large cookie files
app.use(express.json({ limit: "50mb" }));

// --- SCHEDULING ---
// Run at 6:00 AM
cron.schedule("0 6 * * *", () => {
    console.log("Running scheduled automation at 6:00 AM");
    runAutomation();
});

// Run at 10:00 PM (22:00)
cron.schedule("0 22 * * *", () => {
    console.log("Running scheduled automation at 10:00 PM");
    runAutomation();
});

function runAutomation(res = null) {
    exec("node gmail_auto.js", (error, stdout, stderr) => {
        if (error) {
            console.error("Error running automation:", error);
            if (res) return res.status(500).send("Automation failed. Check logs.");
        }
        console.log(stdout);
        if (res) res.send("Automation executed successfully.");
    });
}

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gmail Automation</title>
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; }
        .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        h1 { color: #333; }
        p { color: #666; margin-bottom: 2rem; }
        button { background-color: #007bff; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer; transition: background 0.3s; }
        button:hover { background-color: #0056b3; }
        button:disabled { background-color: #ccc; cursor: not-allowed; }
        #status { margin-top: 1rem; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Gmail Automation Service</h1>
        <p>Status: 🟢 Running</p>
        <p>Scheduled: 06:00 AM & 10:00 PM</p>
        <button id="runBtn" onclick="runNow()">Force Run Now</button>
        <div id="status"></div>
      </div>

      <script>
        function runNow() {
          const btn = document.getElementById('runBtn');
          const status = document.getElementById('status');
          btn.disabled = true;
          btn.innerText = "Running...";
          status.innerText = "Automation started... please wait.";
          
          fetch('/run')
            .then(response => response.text())
            .then(data => {
              status.innerText = data;
              btn.disabled = false;
              btn.innerText = "Force Run Now";
            })
            .catch(err => {
              status.innerText = "Error: " + err;
              btn.disabled = false;
              btn.innerText = "Force Run Now";
            });
        }
      </script>
    </body>
    </html>
  `);
});

// Update cookies remotely
app.post("/update-cookies", (req, res) => {
    try {
        let data = req.body;

        // If the user sends just an array of cookies (e.g. from EditThisCookie), wrap it
        if (Array.isArray(data)) {
            data = {
                cookies: data,
                origins: []
            };
        }

        fs.writeFileSync("gmail_state.json", JSON.stringify(data, null, 2));
        console.log("Cookies updated successfully via API.");
        res.send("Cookies updated successfully. You can now run the automation.");
    } catch (error) {
        console.error("Error updating cookies:", error);
        res.status(500).send("Failed to update cookies.");
    }
});

// Trigger automation
app.get("/run", (req, res) => {
    runAutomation(res);
});

app.listen(3000, () => {
    console.log("Service running on port 3000");
});
