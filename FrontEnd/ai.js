export async function getRecipeFromChefClaude(ingredientsArr) {
    try {
        console.log("hello", ingredientsArr);
        const response = await fetch("http://localhost:3000/api/get-recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: ingredientsArr }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.recipe) {
            throw new Error("No recipe found");
        }

        const { title, image, ingredients, instructions } = data.recipe;
        
        console.log("Ingredients structure:", ingredients,typeof(ingredients)); 
        // Format the recipe nicely for frontend
        const recipeDetails = {
            title,
            image,
            ingredients: ingredients,
            instructions: instructions || "No instructions available.",
        };

        return recipeDetails;

    } catch (error) {
        console.error("Error fetching recipe:", error);
        return "Could not generate a recipe.";
    }
}
