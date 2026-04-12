/**
 * Cloudflare Worker: Chatbot URL Service
 * This worker manages the dynamic API URL for the SpeakBetter app.
 * It provides a secure way to update the backend URL when Cloudflare Tunnel restarts.
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { pathname } = new URL(request.url);

    // 1. UPDATE URL (POST)
    // Used by the PowerShell automation script
    if (request.method === "POST") {
      try {
        const { password, newUrl } = await request.json();
        
        // Security check: Set this in your Worker environment variables
        const SECRET_PASSWORD = env.UPDATE_PASSWORD || "your-safe-password";
        
        if (password !== SECRET_PASSWORD) {
          return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        }

        if (!newUrl) {
          return new Response("Missing newUrl", { status: 400, headers: corsHeaders });
        }

        // Store the URL in the Worker KV (Requires a KV namespace named 'CHATBOT_KV')
        // Fallback: Use a simple memory store if KV is not bound (not persistent across instances)
        if (env.CHATBOT_KV) {
          await env.CHATBOT_KV.put("BACKEND_URL", newUrl);
        } else {
          // Note: This won't be truly persistent without KV
          return new Response("KV Namespace not found. Please bind CHATBOT_KV.", { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ status: "updated", url: newUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response("Invalid Request", { status: 400, headers: corsHeaders });
      }
    }

    // 2. GET URL (GET)
    // Used by the React App (SpeakBetter component)
    if (request.method === "GET") {
      let currentUrl = "http://localhost:8000"; // Default
      
      if (env.CHATBOT_KV) {
        currentUrl = await env.CHATBOT_KV.get("BACKEND_URL") || currentUrl;
      }

      return new Response(JSON.stringify({ apiUrl: currentUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
