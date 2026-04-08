Project Overview

We are implementing a solution to automatically update the API URL for our React app's chatbot every time Cloudflare Tunnel (a free tool to expose local services) generates a new public URL for the backend. This allows the chatbot to always connect to the correct API without needing manual updates or redeployment.

1. Objective

The goal is to dynamically fetch the Cloudflare Tunnel URL (which exposes the local chatbot API) into the React app every time it changes. This will ensure that the app always uses the latest URL for the backend service.

2. What Needs to Change in the React App?
2.1 Fetching the API URL Dynamically

Currently, the API URL may be hardcoded or manually updated in the React app. To make the app more flexible, we need to:

Fetch the Cloudflare Tunnel URL from a public file (e.g., hosted on GitHub Pages or any other accessible location).
Use this URL dynamically for the chatbot’s API calls.
2.2 How to Fetch the URL in the React App

In the React app, we will use the fetch API to request the URL from an external JSON file. This JSON file will be hosted publicly and will contain the latest Cloudflare Tunnel URL.

2.3 Example Code Change

Here's the basic code change that needs to be implemented:

import React, { useEffect, useState } from 'react';

const ChatBot = () => {
  const [apiUrl, setApiUrl] = useState(null);

  useEffect(() => {
    // Fetch the Cloudflare Tunnel URL from the hosted JSON file
    const fetchApiUrl = async () => {
      try {
        const response = await fetch('https://your-username.github.io/your-repo-name/public/url.json');
        const data = await response.json();
        setApiUrl(data.apiUrl);
      } catch (error) {
        console.error('Error fetching the API URL:', error);
      }
    };

    fetchApiUrl();
  }, []);

  return (
    <div>
      {apiUrl ? (
        <div>
          <h2>Chatbot is connected to:</h2>
          <p>{apiUrl}</p>
          {/* Use apiUrl here for API requests */}
        </div>
      ) : (
        <p>Loading API URL...</p>
      )}
    </div>
  );
};

export default ChatBot;
Why Do We Need This?
No Manual Updates: The current URL might change often, especially if the Cloudflare Tunnel restarts. This approach allows the URL to update automatically, without requiring any redeployment of the React app.
Reliability: The React app will always use the correct, up-to-date URL, making the chatbot more reliable for users.
Flexibility: If the backend URL changes or the local environment is restarted, the app will automatically adjust and continue to work without needing manual intervention.
3. Key Benefits of This Approach
Real-Time URL Updates: The React app fetches the latest backend URL every time it loads, ensuring it always communicates with the correct service.
Automation: You won’t need to manually update the URL or redeploy the app when the backend changes.
Simple Integration: This solution can be integrated with minimal changes to the app. The main task is to update the code to fetch the API URL dynamically.
## 5. Local Automation Script (Windows PowerShell)

To automate the process of starting your tunnel and updating the URL without manual intervention, you can use the following PowerShell script. This script starts the tunnel, captures the random URL, and pushes it to your **separate configuration repository**.

### Prerequisites
1.  **Separate Repo:** Create a repo named `chatbot-config` with a `url.json` file.
2.  **Cloudflare:** Install `cloudflared` and ensure it's in your PATH.
3.  **Git:** Ensure you are logged into Git on your machine.

### The Script (`update-tunnel.ps1`)

```powershell
# 1. Configuration
$WORKER_URL = "https://chatbot-url-service.your-name.workers.dev"
$PASSWORD = "your-password-here"
$OLLAMA_PORT = "11434"
$LOG_FILE = "$env:TEMP\cloudflare_tunnel.log"

# 2. Start Cloudflare Tunnel
Write-Host "Starting Cloudflare Tunnel..." -ForegroundColor Cyan
if (Test-Path $LOG_FILE) { Remove-Item $LOG_FILE }
Start-Process "cloudflared" -ArgumentList "tunnel --url http://localhost:$OLLAMA_PORT" -RedirectStandardError $LOG_FILE -NoNewWindow

# 3. Wait for URL generation
Write-Host "Waiting for URL..."
Start-Sleep -Seconds 10

# 4. Extract URL
$LOG_CONTENT = Get-Content $LOG_FILE
$TUNNEL_URL = $LOG_CONTENT | Select-String -Pattern "https://[a-zA-Z0-9-]+\.trycloudflare\.com" | ForEach-Object { $_.Matches.Value } | Select-Object -First 1

if ($null -eq $TUNNEL_URL) {
    Write-Error "Failed to capture URL. Check $LOG_FILE"
    exit
}

Write-Host "Captured: $TUNNEL_URL" -ForegroundColor Green

# 5. INSTANT UPDATE: Send to Cloudflare Worker
$BODY = @{ 
    password = $PASSWORD
    newUrl = $TUNNEL_URL 
} | ConvertTo-Json

Invoke-RestMethod -Uri $WORKER_URL -Method Post -Body $BODY -ContentType "application/json"

Write-Host "Successfully updated Worker! App is now live at: $TUNNEL_URL" -ForegroundColor Green
```

### How to run this on System Wake/Start:
1.  **Task Scheduler:** Open Windows Task Scheduler.
2.  **Create Task:** 
    *   **Trigger:** "At log on" or "On workstation unlock".
    *   **Action:** Start a program.
    *   **Program/script:** `powershell.exe`
    *   **Arguments:** `-ExecutionPolicy Bypass -File "C:\path\to\your\update-tunnel.ps1"`

---

## 6. Conclusion
By using a **separate repository** for the `url.json` and this PowerShell script, your React app (hosted on Netlify/GitHub Pages) will fetch the latest URL every time a user opens the chat, while your main site stays stable and never needs to rebuild just for a link change.