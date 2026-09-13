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
