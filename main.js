import express from "express";

const app = express();
const PORT = 3333;

app.listen(PORT);

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});
