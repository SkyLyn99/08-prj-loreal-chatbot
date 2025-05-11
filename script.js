// DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Initial greeting
chatWindow.innerHTML = "👋 Hello! How can I help you today about L’Oréal products?";

// Send user message to Cloudflare Worker
async function getChatbotResponse(message) {
  const CLOUDFLARE_WORKER_URL = "https://your-worker-name.your-subdomain.workers.dev"; // Replace with your real URL

  const payload = {
    messages: [
      { role: "user", content: message }
    ]
  };

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const chatbotMessage = data.choices?.[0]?.message?.content || "Sorry, I didn’t catch that.";
    return chatbotMessage;
  } catch (error) {
    console.error("Error communicating with the Cloudflare Worker:", error);
    return "Oops! Something went wrong while talking to the assistant.";
  }
}

// Handle form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display user's message
  chatWindow.innerHTML += `<div class="user-msg">🧍‍♂️ ${userMessage}</div>`;
  userInput.value = "";

  // Show loading
  chatWindow.innerHTML += `<div class="bot-msg">🤖 Typing...</div>`;

  // Get chatbot response
  const botResponse = await getChatbotResponse(userMessage);

  // Replace loading with actual bot response
  const allMessages = chatWindow.querySelectorAll(".bot-msg");
  const lastBotMsg = allMessages[allMessages.length - 1];
  lastBotMsg.innerHTML = `🤖 ${botResponse}`;
});
