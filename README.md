# Gmail Automation Service

A Node.js service running Playwright in a Docker container (with Xvfb) to automate Gmail interactions. Designed to be deployed on Render.com.

## 🚀 Deploy to Render

Click the button below to deploy this project to Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/praneethreddie/emailautomation)

## 🛠 Setup & Deployment

1.  **Push to GitHub**: Create a repo and push this code.
2.  **Update Cookies**:
    *   **Option A (Pre-filled)**: The `gmail_state.json` is already pre-filled with your cookies. Just deploy!
    *   **Option B (Remote Update)**: If cookies expire, use the `/update-cookies` endpoint to upload new ones without redeploying.
3.  **Run**:
    *   Trigger automation via: `https://<your-app>.onrender.com/run`

## 📂 Project Structure

*   `server.js`: Express server with API endpoints.
*   `gmail_auto.js`: Playwright automation script.
*   `Dockerfile`: Configuration for Render deployment (includes Xvfb).
*   `gmail_state.json`: Stores login session cookies.
