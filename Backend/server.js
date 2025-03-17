import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch"; // Make sure you import fetch correctly

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// ✅ Allow frontend (change port if needed)
app.use(cors({ origin: "http://localhost:5173" }));

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY; // API Key from Spoonacular

app.post("/api/get-recipe", async (req, res) => {
    let { ingredients } = req.body;
    if (typeof ingredients === "string") {
        ingredients = ingredients.split(",").map(item => item.trim());
    }
    console.log("Received ingredients:", ingredients);

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: "Missing ingredients" });
    }

    try {
        // Join ingredients into a comma-separated string
        const ingredientsString = ingredients.join(", ");

        // Make a request to Spoonacular's recipe search endpoint
        const response = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsString}&number=1&apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Recipes found:", data);

        if (data.length === 0) {
            return res.status(404).json({ error: "No recipes found" });
        }

        const recipe = data[0]; // Get the first recipe
        const recipeId = recipe.id; // Get the recipe ID to fetch details

        // Make a second request to get the full recipe details, including instructions
        const recipeDetailsResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!recipeDetailsResponse.ok) {
            throw new Error(`Error fetching full recipe details: ${recipeDetailsResponse.statusText}`);
        }

        const recipeDetailsData = await recipeDetailsResponse.json();
        console.log("Recipe details response:", recipeDetailsData);  // Log full response

        const { instructions } = recipeDetailsData;
        if (!instructions) {
            console.log("No instructions found for this recipe.");
        }

        // Extract used ingredients from the full recipe details
        const ingredientsList = recipeDetailsData.extendedIngredients.map(ingredient => ingredient.original);
        console.log("reched here stes is great",ingredientsList)
        // Return the recipe details with instructions and ingredients
        res.json({
            recipe: {
                title: recipe.title,
                image: recipe.image,
                ingredients: ingredientsList,  // Send the full ingredients list
                instructions: instructions || "No instructions available.",
            },
        });
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "Could not generate any recipe." });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
