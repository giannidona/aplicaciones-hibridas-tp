import express from "express";
import productRoutes from "./api/routes/products.routes.js";
import brandRoutes from "./api/routes/brands.routes.js";

const app = express();
const PORT = 3333;

app.listen(PORT);

app.use(productRoutes);
app.use(brandRoutes);
