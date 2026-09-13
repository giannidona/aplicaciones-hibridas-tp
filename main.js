import express from "express";
import db from "./db/connection.js";

const app = express();
const PORT = 3333;

app.listen(PORT);

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

async function data() {
  const data = await db.collection("products").countDocuments();
  return data;
}
console.log(await data());
