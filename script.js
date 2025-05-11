// Load your API key (assumes secrets.js is included in HTML BEFORE script.js)
import { apiKey } from "./secrets.js"; // If using ES modules

// DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Initial greeting
chatWindow.innerHTML = "👋 Hello! How can I help you today about L’Oréal products?";

// Function to send user input to OpenAI API
async function getChatbotResponse(message) {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const systemPrompt = {
    role: "system",
    content:
      "You are a helpful AI assistant who only answers questions about L’Oréal products, beauty routines, and personalized skincare or haircare recommendations. Do not respond to questions unrelated to L’Oréal."
  };

  const userPrompt = {
    role: "user",
    content: message
  };

  const payload = {
    model: "gpt-3.5-turbo", // or "gpt-4" if available and desired
    messages: [systemPrompt, userPrompt],
    temperature: 0.7
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const chatbotMessage = data.choices[0].message.content;
    return chatbotMessage;
  } catch (error) {
    console.error("Error fetching from OpenAI:", error);
    return "Sorry, I had trouble connecting to the assistant.";
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
