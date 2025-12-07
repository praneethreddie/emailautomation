const express = require("express");
const { exec } = require("child_process");

const app = express();
const fs = require("fs");

// Increase payload limit for large cookie files
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send("Gmail automation service is running.");
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
    exec("node gmail_auto.js", (error, stdout, stderr) => {
        if (error) {
            console.error("Error running automation:", error);
            return res.status(500).send("Automation failed.");
        }
        console.log(stdout);
        res.send("Automation executed successfully.");
    });
});

app.listen(3000, () => {
    console.log("Service running on port 3000");
});
