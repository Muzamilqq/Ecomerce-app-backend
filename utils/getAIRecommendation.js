// FIX: removed res.status(500).json() calls from this utility function.
// A utility should NEVER call res directly — it's not an Express route handler.
// Calling res.json() here after the controller has already started responding
// causes "Cannot set headers after they are sent" crashes.
// Instead, this function now throws errors and returns a result object,
// letting the controller (in productController.js) handle the response.

export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const geminiPrompt = `
      Here is a list of available products:
      ${JSON.stringify(products, null, 2)}

      Based on the following user request, filter and suggest the best matching products:
      "${userPrompt}"

      Only return the matching products in JSON format. Return ONLY valid JSON, no markdown, no explanation.
  `;

  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: geminiPrompt }] }],
    }),
  });

  const data = await response.json();
  const aiResponseText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  const cleanedText = aiResponseText.replace(/```json|```/g, "").trim();

  if (!cleanedText) {
    throw new Error("AI response is empty or invalid.");
  }

  let parsedProducts;
  try {
    parsedProducts = JSON.parse(cleanedText);
  } catch (error) {
    throw new Error("Failed to parse AI response as JSON.");
  }

  return { success: true, products: parsedProducts };
}
