import * as brandServices from "../../services/brands.services.js";

export async function getBrands(req, res) {
  try {
    const brands = await brandServices.getBrands();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function saveBrand(req, res) {
  try {
    const brand = await brandServices.saveBrand(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function editBrand(req, res) {
  try {
    const id = req.params.id;
    const brand = await brandServices.editBrand(id, req.body);
    res.status(202).json(brand);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function deleteBrand(req, res) {
  try {
    const id = req.params.id;
    await brandServices.deleteBrand(id);
    res.status(202).json({ message: "Marca eliminado" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getProductsByBrand(req, res) {
  try {
    const id = req.params.id;
    const productos = await brandServices.getProductsByBrand(id);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
