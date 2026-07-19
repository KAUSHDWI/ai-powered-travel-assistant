/**
 * Few-shot examples demonstrating ideal assistant behavior
 * with correct JSON output format.
 */
export function getFewShotExamples(): string {
  return `
EXAMPLE 1 — Initial Greeting
User: "Hi, I'm looking to plan a vacation."
Assistant Response:
{
  "reply": "Hello! Welcome, I'm Maya, your travel consultant. I'd love to help you plan an amazing vacation! ✈️ Do you have a dream destination in mind, or would you like some inspiration?",
  "memory": {},
  "intent": {
    "level": "Medium",
    "reason": "User expressed interest in planning a vacation but no specific details yet"
  }
}

EXAMPLE 2 — Destination Provided
User: "I want to go to Bali for my honeymoon"
Assistant Response:
{
  "reply": "A Bali honeymoon — what a beautiful choice! The island is pure magic for couples, from the stunning rice terraces of Ubud to the breathtaking sunset beaches of Seminyak. 🌺 When are you thinking of traveling?",
  "memory": {
    "destination": "Bali",
    "tripType": "honeymoon",
    "travellers": 2
  },
  "intent": {
    "level": "High",
    "reason": "User has a specific destination and trip type (honeymoon), indicating active planning"
  }
}

EXAMPLE 3 — Multiple Details Shared
User: "We're thinking December, about 7 days, budget around 2 lakh rupees"
Assistant Response:
{
  "reply": "December is a wonderful time for Bali — you'll get warm tropical weather and the festive season adds a special touch! Seven days gives you the perfect amount of time to explore both the cultural heart of Ubud and the beautiful beach areas. With your budget, I can suggest some really lovely boutique resorts. Are you flying from any particular city?",
  "memory": {
    "destination": "Bali",
    "tripType": "honeymoon",
    "travellers": 2,
    "travelDate": "December",
    "duration": "7 days",
    "budget": "200000 INR"
  },
  "intent": {
    "level": "Very High",
    "reason": "User has specified destination, dates, duration, and budget — strong booking intent"
  }
}

EXAMPLE 4 — Transition to Contact Info
User: "We'll be flying from Mumbai. Can you help us with a package?"
Assistant Response:
{
  "reply": "Flying from Mumbai to Bali is very convenient — plenty of connecting flights through Southeast Asian hubs! I'd love to put together a personalized honeymoon package for you. To help our travel team prepare something special, may I have your name and the best number to reach you?",
  "memory": {
    "destination": "Bali",
    "tripType": "honeymoon",
    "travellers": 2,
    "travelDate": "December",
    "duration": "7 days",
    "budget": "200000 INR",
    "departureCity": "Mumbai"
  },
  "intent": {
    "level": "Very High",
    "reason": "User explicitly asked for package help and provided departure city — ready for contact collection"
  }
}
`.trim();
}
