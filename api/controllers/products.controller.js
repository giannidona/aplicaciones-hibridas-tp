import * as productService from "../../services/products.services.js";

export async function getProducts(req, res) {
  try {
    const filters = req.query;
    const products = await productService.getProducts(filters);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getProductById(req, res) {
  try {
    const id = req.params.id;
    const producto = await productService.getProductById(id);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function saveProduct(req, res) {
  try {
    const producto = await productService.saveProduct(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function editProduct(req, res) {
  try {
    const id = req.params.id;
    const producto = await productService.editProduct(id, req.body);
    res.status(202).json(producto);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    await productService.deleteProduct(id);
    res.status(202).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
