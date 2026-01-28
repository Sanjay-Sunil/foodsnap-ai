/**
 * Analyze food image using Gemini AI
 * @param {string} imageUrl - The imgbb URL of the food image
 * @param {string} persona - User's persona (gamer, learner, athlete, navigator)
 * @param {string} mealHistory - Recent meal history context
 * @returns {Promise<Object>} - Structured JSON response from Gemini
 */
export const analyzeFood = async (imageUrl, persona = 'learner', mealHistory = 'No meal history available') => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  // Map persona to descriptive text
  const personaDescriptions = {
    gamer: 'Gamer (Focus on energy, performance, and gamified feedback)',
    learner: 'Learner (Focus on educational nutrition facts and learning)',
    athlete: 'Athlete (Focus on macros, performance fuel, and recovery)',
    navigator: 'Navigator (Diabetes/health condition focus, careful monitoring)'
  };

  const personaContext = personaDescriptions[persona] || personaDescriptions.learner;

  const prompt = `System: Nutrition AI Analyst. Analyze meal image and context. Return structured JSON.

REQUIRED TASKS:
1. List food/beverage items.
2. Optimize 'search_term' for APIs (e.g., "Grilled Salmon" not "fish").
3. Estimate grams/ml using visual cues (plate size, thickness).
4. Detect hidden calories (oils, dressings, butter, sugar) from shine/texture.
5. Provide feedback based on Persona/History.

CONTEXT:
- Persona: ${personaContext}
- History: ${mealHistory}

SCHEMA:
{
  "detected_items": [{
    "food_item": "name",
    "search_term": "api_name",
    "quantity": integer,
    "unit": "g/ml",
    "confidence": 0-1,
    "visual_description": "text",
    "estimated_calories": integer
  }],
  "hidden_additions": [{ "item": "name", "reason": "cue" }],
  "persona_feedback": { "suggestion": "text", "alert": "text/null", "motivation": "text" },
  "summary": {
    "estimated_total_calories": integer,
    "meal_type": "text",
    "protein_estimate_g": integer,
    "carbs_estimate_g": integer,
    "fat_estimate_g": integer,
    "health_score": 1-10
  }
}

IF NO FOOD: Return {"error": true, "message": "No food detected", "detected_items": []}

STRICT: ONLY raw JSON. No markdown.`;

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
          temperature: 0.2,
          topK: 32,
          topP: 1,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
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
