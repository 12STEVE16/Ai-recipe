import React, { useState } from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import { getRecipeFromChefClaude } from "./ai";

export default function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [recipeShown, setRecipeShown] = useState(false);
    const [recipe, setRecipe] = useState("");

    function toggleRecipeShown() {
        if (!recipeShown && !recipe) { // Fetch only if not already fetched
            fetchRecipe();
        }
        setRecipeShown(prevShown => !prevShown);
    }

    function addIngredient(event) {
        event.preventDefault(); // Prevent page reload
        const formData = new FormData(event.target);
        const newIngredient = formData.get("ingredient").trim();

        if (newIngredient) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
            event.target.reset(); // Clear input field
        }
    }

    async function fetchRecipe() {
        try {
            console.log("Ingredients:", ingredients); // Check the ingredients before using join()
            // Ensure ingredients is an array before calling join
            if (Array.isArray(ingredients)) {
                const generatedRecipe = await getRecipeFromChefClaude(ingredients.join(", "));
                setRecipe(generatedRecipe);
            } else {
                throw new Error("Ingredients is not an array");
            }
        } catch (error) {
            console.error("Error fetching recipe:", error);
            setRecipe("Sorry, I couldn't fetch a recipe at the moment.");
        }
    }

    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <IngredientsList ingredients={ingredients} toggleRecipeShown={toggleRecipeShown} />
            )}

            {recipeShown && <ClaudeRecipe recipe={recipe} />}
        </main>
    );
}
