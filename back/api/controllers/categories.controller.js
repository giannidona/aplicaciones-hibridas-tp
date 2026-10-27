import * as categoriesServices from "../../services/categories.services.js";

export async function getCategories(req, res) {
  try {
    const categories = await categoriesServices.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function saveCategory(req, res) {
  try {
    const category = await categoriesServices.saveCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function editCategory(req, res) {
  try {
    const id = req.params.id;
    const category = await categoriesServices.editCategory(id, req.body);
    res.status(202).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const id = req.params.id;
    await categoriesServices.deleteCategory(id);
    res.status(202).json({ message: "Categoria eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const id = req.params.id;
    const productos = await categoriesServices.getProductsByCategory(id);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
