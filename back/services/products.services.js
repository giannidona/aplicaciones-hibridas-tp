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

  const ordenesValidos = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };
  if (filters?.sort && ordenesValidos[filters.sort]) {
    pipeline.push({ $sort: ordenesValidos[filters.sort] });
  }

  // Paginado: $facet corre dos sub-pipelines en paralelo sobre el mismo
  // resultado parcial - uno recorta la pagina pedida (skip/limit) y el
  // otro cuenta el total, sin tener que consultar la coleccion dos veces.
  const page = Math.max(parseInt(filters?.page) || 1, 1);
  const limit = Math.max(parseInt(filters?.limit) || 12, 1);

  pipeline.push({
    $facet: {
      items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const [resultado] = await db
    .collection("products")
    .aggregate(pipeline)
    .toArray();

  const total = resultado?.totalCount?.[0]?.count ?? 0;

  return {
    items: resultado?.items ?? [],
    total,
    page,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
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
