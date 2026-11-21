import db from "../db/connection.js";

// Escapa caracteres especiales de regex para que una busqueda como
// "crema (facial)" no rompa el $regex de Mongo.
function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProducts(filters = {}) {
  const match = {};

  if (filters?.categoryId) match.categoryId = filters.categoryId;
  if (filters?.brandId) match.brandId = filters.brandId;

  if (filters?.isFeatured !== undefined)
    match.isFeatured = filters.isFeatured === "true";

  if (filters?.price_min || filters?.price_max) {
    match.price = {};
    if (filters?.price_min) match.price.$gte = parseFloat(filters.price_min);
    if (filters?.price_max) match.price.$lte = parseFloat(filters.price_max);
  }

  const pipeline = [];
  if (Object.keys(match).length) pipeline.push({ $match: match });

  // El $lookup trae la marca embebida para poder buscar por su nombre
  // ademas del nombre del producto, en la misma consulta a la base.
  pipeline.push(
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
  );

  if (filters?.search) {
    const regex = new RegExp(escaparRegex(filters.search), "i");
    pipeline.push({
      $match: { $or: [{ name: regex }, { "brand.name": regex }] },
    });
  }

  return await db.collection("products").aggregate(pipeline).toArray();
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
