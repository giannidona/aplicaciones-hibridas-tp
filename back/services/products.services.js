import db from "../db/connection.js";

export async function getProducts(filters = {}) {
  const filter = {};

  if (filters?.categoryId) filter.categoryId = filters.categoryId;
  if (filters?.brandId) filter.brandId = filters.brandId;

  if (filters?.isFeatured !== undefined)
    filter.isFeatured = filters.isFeatured === "true";

  if (filters?.price_min || filters?.price_max) {
    filter.price = {};
    if (filters?.price_min) filter.price.$gte = parseFloat(filters.price_min);
    if (filters?.price_max) filter.price.$lte = parseFloat(filters.price_max);
  }

  return await db.collection("products").find(filter).toArray();
}

import { randomUUID } from "crypto";

// Corregido a pedido del profesor: antes esto era un findOne pelado y el
// frontend hacia una segunda llamada aparte a /brands/:id para resolver el
// nombre de la marca (2 idas y vueltas). Mongo no tiene JOIN como SQL, pero
// el framework de agregacion si tiene $lookup para resolver esto en una sola
// consulta a la base, trayendo la marca ya resuelta adentro del producto.
export async function getProductById(id) {
  const [producto] = await db
    .collection("products")
    .aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
    ])
    .toArray();

  return producto;
}

export async function saveProduct(producto) {
  producto._id = randomUUID();
  await db.collection("products").insertOne(producto);
  return producto;
}

export async function editProduct(id, producto) {
  await db.collection("products").replaceOne({ _id: id }, producto);
  return producto;
}

export async function deleteProduct(id) {
  await db.collection("products").deleteOne({ _id: id });
  return id;
}
