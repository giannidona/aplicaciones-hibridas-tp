import { createPage, renderMenu, renderProductGrid } from "../utils.js";
import {
  getCategories,
  getCategoryById,
  getProductsByCategoryWithBrand,
} from "../../services/categories.services.js";

export async function renderHome(req, res) {
  try {
    const categories = await getCategories();
    const html = createPage("Inicio", renderMenu(categories));
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}

export async function renderCategoryPage(req, res) {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).send("Categoría no encontrada");
    }

    const products = await getProductsByCategoryWithBrand(id);
    const html = createPage(
      category.name,
      renderProductGrid(category.name, products),
    );
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
