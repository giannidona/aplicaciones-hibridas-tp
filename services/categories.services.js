import { randomUUID } from "crypto";
import db from "../db/connection.js";

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

export async function getProductsByCategory(categoriesId) {
  return await db.collection("products").find({ categoriesId }).toArray();
}
