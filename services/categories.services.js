import { randomUUID } from "crypto";
import db from "../db/connection.js";
import { attachBrandNames } from "./brands.services.js";

export async function getCategories() {
  return await db.collection("categories").find({}).toArray();
}

export async function saveCategory(categories) {
  categories._id = randomUUID();
  await db.collection("categories").insertOne(categories);
  return categories;
}

export async function editCategory(id, categories) {
  await db.collection("categories").replaceOne({ _id: id }, categories);
  return categories;
}

export async function deleteCategory(id) {
  await db.collection("categories").deleteOne({ _id: id });
  return id;
}

export async function getProductsByCategory(categoryId) {
  return await db.collection("products").find({ categoryId }).toArray();
}

export async function getProductsByCategoryWithBrand(categoryId) {
  const products = await getProductsByCategory(categoryId); // la que ya tenías
  return await attachBrandNames(products);
}

export async function getCategoryById(id) {
  return await db.collection("categories").findOne({ _id: id });
}
