/**
 * Fetch detailed nutritional information from Spoonacular API
 * @param {Array} detectedItems - Array of detected food items from Gemini
 * @returns {Promise<Array>} - Array of items with enriched nutritional data
 */
export const fetchNutritionalDetails = async (detectedItems) => {
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!API_KEY) {
    console.error('Spoonacular API key is missing');
    return detectedItems;
  }

  // Construct the ingredient list string for Spoonacular
  // Format: "amount unit name" per line
  const ingredientList = detectedItems
    .map(item => `${item.quantity || ''} ${item.unit || ''} ${item.food_item}`)
    .join('\n');

  console.log('Sending to Spoonacular:', ingredientList);

  const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${API_KEY}&includeNutrition=true`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        ingredientList: ingredientList,
        servings: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Spoonacular Enriched Nutritional Data:', data);

    // Map Spoonacular data back to our structure carefully
    const enrichedItems = detectedItems.map((item, index) => {
      let spoonData = data[index];

      // Verification check: does the original name match?
      const itemQuery = (item.food_item || '').toLowerCase();
      const spoonOriginal = (spoonData?.originalName || spoonData?.original || '').toLowerCase();

      if (spoonData && !spoonOriginal.includes(itemQuery) && data.length > 0) {
        // Try to find a better match by name in the response if index seems wrong
        const betterMatch = data.find(d => (d.originalName || d.original || '').toLowerCase().includes(itemQuery));
        if (betterMatch) spoonData = betterMatch;
      }

      // Helper to safely get nutrient or fallback to Gemini estimate
      const getVal = (spoonNutrientName, fallbackVal) => {
        if (spoonData?.nutrition?.nutrients) {
          const nutrients = spoonData.nutrition.nutrients;
          const found = nutrients.find(n => n.name === spoonNutrientName);
          if (found) return parseFloat(found.amount.toFixed(2));
        }
        return parseFloat((fallbackVal || 0).toFixed(2));
      };

      return {
        ...item,
        verified_nutrition: !!(spoonData && spoonData.nutrition),
        spoonacular_data: spoonData,
        image_url: spoonData?.image ? `https://spoonacular.com/cdn/ingredients_100x100/${spoonData.image}` : null,
        estimated_calories: getVal('Calories', item.estimated_calories),
        protein_g: getVal('Protein', item.protein_g),
        fat_g: getVal('Fat', item.fat_g),
        carbs_g: getVal('Carbohydrates', item.carbs_g),
        sugar_g: getVal('Sugar', item.sugar_g),
        sodium_mg: getVal('Sodium', item.sodium_mg),
        fiber_g: getVal('Fiber', item.fiber_g)
      };
    });

    // Calculate new summary totals based on enriched items
    const summary = enrichedItems.reduce((acc, item) => {
      acc.estimated_total_calories += item.estimated_calories || 0;
      acc.protein_estimate_g += item.protein_g || 0;
      acc.carbs_estimate_g += item.carbs_g || 0;
      acc.fat_estimate_g += item.fat_g || 0;
      return acc;
    }, {
      estimated_total_calories: 0,
      protein_estimate_g: 0,
      carbs_estimate_g: 0,
      fat_estimate_g: 0
    });

    // Final rounding of summary
    Object.keys(summary).forEach(key => {
      summary[key] = parseFloat(summary[key].toFixed(2));
    });

    console.log('Recalculated Summary:', summary);
    console.log('Final Enriched Items Array:', enrichedItems);

    return { items: enrichedItems, summary };
  } catch (error) {
    console.error('Error fetching data from Spoonacular:', error);
    return { items: detectedItems, summary: null }; // Return original items on failure
  }
};
