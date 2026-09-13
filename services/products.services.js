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

export async function getProductById(id) {
  return await db.collection("products").findOne({ _id: id });
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
