import express from "express";
import cors from "cors";
import { cinemaRoutes } from "./presentation/cinema/cinemaRoutes.js";
import { userRoutes } from "./presentation/user/userRoutes.js";
import { authRoutes } from "./presentation/auth/authRoutes.js"
import { authenticate } from "./infra/http/middlewares/authenticate.js"

import { config } from "./config.js";
import { productRoutes } from "./presentation/products/productRoutes.js";
import { movieRouter } from "./presentation/movie/movieRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/cinemas", authenticate, cinemaRoutes);
app.use("/users", authenticate, userRoutes);
app.use("/auth", authRoutes);
app.use("/products", authenticate, productRoutes);
app.use("/movies", authenticate, movieRouter);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});