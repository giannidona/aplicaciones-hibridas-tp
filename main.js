import express from "express";
import productRoutes from "./api/routes/products.routes.js";
import brandRoutes from "./api/routes/brands.routes.js";
import categoryRoutes from "./api/routes/categories.routes.js";
import pageRoutes from "./page/routes/pages.routes.js";

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(productRoutes);
app.use(brandRoutes);
app.use(categoryRoutes);
app.use(pageRoutes);

app.listen(PORT, () => console.log("Funcionando en el puerto " + PORT));
