// Reference: https://console.groq.com/docs/text-chat
async function estimatePrice(ingredients, location) {
  // Make a POST request to the Groq API for chat completions
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions", // Groq API endpoint for chat completions
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // Use your Groq API key from env
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // AI model to use for the request
        messages: [
          {
            role: "user",
            // Give a specific prompt to the AI, asking for grocery price estimates in {location}, including the ingredients list in the request
            // The prompt also ask to return a JSON array with the ingredient name, minimum price and maximum price
            content: `Estimate grocery prices in ${location}, Canada as of 2026 for these ingredients: ${ingredients.join(", ")}. Consider average prices from major grocery stores like Loblaws, No Frills, and Metro. 
            Return JSON array only, no extra text, no markdown: [{"ingredient": "name", "min": 0.00, "max": 0.00}]`,
          },
        ],
      }),
    },
  );

  // Check if the response is successful
  if (!response.ok) {
    throw new Error(
      `Error fetching Groq API: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  console.log("Groq response:", JSON.stringify(data, null, 2)); // Log the entire response for debugging

  // Extract the content from the response
  const content = data.choices[0].message.content;

  // Clean the content to remove any markdown or formatting and parse the JSON
  const cleanContent = content
    .replace(/```json\n?|\n?```/g, "")
    .replace(/\*\*.*?\*\*/g, "")
    .trim();

  // Use regex to extract the JSON array from the cleaned content
  const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch[0]);
}

module.exports = { estimatePrice };
