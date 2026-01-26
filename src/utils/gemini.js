/**
 * Analyze food image using Gemini AI
 * @param {string} imageUrl - The imgbb URL of the food image
 * @param {string} persona - User's persona (gamer, learner, athlete, navigator)
 * @param {string} mealHistory - Recent meal history context
 * @returns {Promise<Object>} - Structured JSON response from Gemini
 */
export const analyzeFood = async (imageUrl, persona = 'learner', mealHistory = 'No meal history available') => {
  const API_KEY = 'AIzaSyBZ_AdbDYobSG-YfjZEFdqhnpujPeHuW_g';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // Map persona to descriptive text
  const personaDescriptions = {
    gamer: 'Gamer (Focus on energy, performance, and gamified feedback)',
    learner: 'Learner (Focus on educational nutrition facts and learning)',
    athlete: 'Athlete (Focus on macros, performance fuel, and recovery)',
    navigator: 'Navigator (Diabetes/health condition focus, careful monitoring)'
  };

  const personaContext = personaDescriptions[persona] || personaDescriptions.learner;

  const prompt = `**System Instruction:**
You are a professional nutrition AI assistant. Your task is to analyze the provided image of a meal and return a structured JSON response.

**Task Requirements:**
1. **Identify Items:** List every distinct food and beverage item visible in the image.
2. **Standardize Names:** Provide a 'search_term' for each item that is optimized for lookup in the Edamam or USDA Nutrition API (e.g., use "Grilled Chicken Breast" instead of "chicken").
3. **Estimate Quantity:** Estimate the weight (grams) or volume (ml) using visual context, plate size, and common portion sizes. Be specific and realistic.
4. **Identify Hidden Ingredients:** Look for textures, shine, or visual cues that imply "invisible" calories (e.g., oil, butter, heavy cream, sugar dressings, cheese, sauces).
5. **Personalized Logic:** Apply the user's Persona and Meal History to provide tailored suggestions and alerts.

**Visual Analysis Guidelines:**
- Use the plate as a reference for portion estimation (standard dinner plate ~25cm diameter)
- Look for oil sheen on foods indicating frying or added fats
- Check for visible sauces, dressings, or toppings
- Estimate density and thickness of food items
- Consider cooking methods based on appearance (grilled, fried, steamed, etc.)

**User Context:**
- Persona: ${personaContext}
- Meal History: ${mealHistory}
- Image Source: ${imageUrl}

**CRITICAL: If the image does NOT contain food items, return this exact JSON:**
{
  "error": true,
  "message": "No food items detected in the image. Please capture a clear photo of your meal.",
  "detected_items": [],
  "hidden_additions": [],
  "persona_feedback": null,
  "summary": null
}

**Output Format (STRICT JSON ONLY - No markdown, no code blocks, just pure JSON):**
{
  "detected_items": [
    {
      "food_item": "string (common name)",
      "search_term": "string (API-friendly, specific)",
      "quantity": integer (grams for solids, ml for liquids),
      "unit": "string (g or ml)",
      "confidence": float (0.0 to 1.0),
      "visual_description": "string (color, texture, cooking method observed)",
      "estimated_calories": integer,
      
    }
  ],
  "hidden_additions": [
    { 
      "item": "string", 
      "estimated_amount": "string",
      "reason": "string (visual cue that suggests this)" 
    }
  ],
  "persona_feedback": {
    "suggestion": "string (personalized advice based on persona)",
    "alert": "string or null (Red flag if medical condition requires it, especially for Navigator)",
    "motivation": "string (encouraging message, gamified for Gamer persona)"
  },
  "summary": {
    "estimated_total_calories": integer,
    "meal_type": "string (breakfast/lunch/dinner/snack)",
    "protein_estimate_g": integer,
    "carbs_estimate_g": integer,
    "fat_estimate_g": integer,
    "health_score": integer (1-10 based on nutritional balance)
  }
}

IMPORTANT: Return ONLY valid JSON. No explanations, no markdown formatting, no code blocks. Just the raw JSON object.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: await fetchImageAsBase64(imageUrl)
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096
        }
      })
    });

    const data = await response.json();
    console.log('Gemini raw response:', data);

    // Extract the text content from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No response from Gemini');
    }

    // Clean and parse the JSON response
    let cleanedJson = textContent.trim();

    // Remove markdown code blocks if present
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.slice(7);
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.slice(3);
    }
    if (cleanedJson.endsWith('```')) {
      cleanedJson = cleanedJson.slice(0, -3);
    }
    cleanedJson = cleanedJson.trim();

    const analysisResult = JSON.parse(cleanedJson);
    console.log('Gemini analysis result:', analysisResult);

    return analysisResult;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
};

/**
 * Fetch image from URL and convert to base64
 * @param {string} url - Image URL
 * @returns {Promise<string>} - Base64 encoded image data
 */
async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove the data URL prefix to get just the base64 data
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
