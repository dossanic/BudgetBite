const supabase = require("../supabaseClient");

// Maps a saved_recipes DB row (snake_case) to the camelCase shape the frontend uses
function mapRow(row) {
  return {
    id: row.recipe_id,
    title: row.title,
    image: row.image,
    source: row.source,
    recipeUrl: row.recipe_url,
    savedAt: row.created_at,
  };
}

// GET /favorites?user_id=X              -> { favorites: [...] }
// GET /favorites?user_id=X&recipe_id=Y  -> { favorited: boolean }
async function getFavorites(req, res) {
  const userId = String(req.query?.user_id || "").trim();
  const recipeId = req.query?.recipe_id ? String(req.query.recipe_id).trim() : null;

  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }

  let query = supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (recipeId) {
    query = query.eq("recipe_id", recipeId);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (recipeId) {
    return res.json({ favorited: data.length > 0 });
  }

  return res.json({ favorites: data.map(mapRow) });
}

// POST /favorites  body: { user_id, recipe: { id, title, image, source, recipeUrl } }
async function addFavorite(req, res) {
  const userId = String(req.body?.user_id || "").trim();
  const recipe = req.body?.recipe || {};

  if (!userId || !recipe.id) {
    return res.status(400).json({ error: "user_id and recipe.id are required" });
  }

  const { error } = await supabase.from("saved_recipes").upsert(
    {
      user_id: userId,
      recipe_id: String(recipe.id),
      title: recipe.title || null,
      image: recipe.image || null,
      source: recipe.source || null,
      recipe_url: recipe.recipeUrl || null,
    },
    { onConflict: "user_id,recipe_id" },
  );

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ success: true });
}

// DELETE /favorites?user_id=X&recipe_id=Y
async function removeFavorite(req, res) {
  const userId = String(req.query?.user_id || "").trim();
  const recipeId = String(req.query?.recipe_id || "").trim();

  if (!userId || !recipeId) {
    return res.status(400).json({ error: "user_id and recipe_id are required" });
  }

  const { error } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_id", recipeId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ success: true });
}

module.exports = { getFavorites, addFavorite, removeFavorite };
