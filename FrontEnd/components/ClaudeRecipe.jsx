import React from "react";

export default function ClaudeRecipe({ recipe }) {
    return (
        <section>
            <h2>Chef Claude Recommends:</h2>
            <article className="suggested-recipe-container" aria-live="polite">
                {recipe ? (
                    <>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image} alt={recipe.title} />
                        
                        <h4>Ingredients:</h4>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>

                        <h4>Instructions:</h4>
                        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                    </>
                ) : (
                    <p>Loading recipe...</p>
                )}
            </article>
        </section>
    );
}
