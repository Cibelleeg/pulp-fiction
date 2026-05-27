import express from "express";
import cors from "cors";
import { cinemaRoutes } from "./presentation/cinema/cinemaRoutes.js";
import { userRoutes } from "./presentation/user/userRoutes.js";
import { config } from "./config.js";
import { productRoutes } from "./presentation/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/cinemas", cinemaRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});