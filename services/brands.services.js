import { randomUUID } from "crypto";
import db from "../db/connection.js";

export async function getBrands() {
  return await db.collection("brands").find({}).toArray();
}

export async function saveBrand(brand) {
  brand._id = randomUUID();
  await db.collection("brands").insertOne(brand);
  return brand;
}

export async function editBrand(id, brand) {
  await db.collection("brands").replaceOne({ _id: id }, brand);
  return brand;
}

export async function deleteBrand(id) {
  await db.collection("brands").deleteOne({ _id: id });
  return id;
}

export async function getProductsByBrand(brandId) {
  return await db.collection("products").find({ brandId }).toArray();
}

export async function attachBrandNames(products) {
  const brandIds = products.map((p) => p.brandId);

  const uniqueBrandIds = [...new Set(brandIds)];

  const brands = await db
    .collection("brands")
    .find({ _id: { $in: uniqueBrandIds } })
    .toArray();

  const brandMap = {};
  for (const brand of brands) {
    brandMap[brand._id] = brand.name;
  }

  return products.map((p) => ({
    ...p,
    brandName: brandMap[p.brandId] || null,
  }));
}

export async function getBrandById(id) {
  return await db.collection("brands").findOne({ _id: id });
}
