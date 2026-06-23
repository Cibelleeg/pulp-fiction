import express from "express";
import cors from "cors";
import { cinemaRoutes } from "./presentation/cinema/cinemaRoutes.js";
import { userRoutes } from "./presentation/user/userRoutes.js";
import { authRoutes } from "./presentation/auth/authRoutes.js"

import { config } from "./config.js";
import { productRoutes } from "./presentation/products/productRoutes.js";
import { sessionRoutes } from "./presentation/session/sessionRoutes.js";
import { comboRoutes } from "./presentation/combo/comboRoutes.js";
import { pedidoRoutes } from "./presentation/pedido/pedidoRoutes.js";
import { ingressoRoutes } from "./presentation/ingresso/ingressoRoutes.js";
import { salaRoutes } from "./presentation/sala/salaRoutes.js";
import { assentoRoutes } from "./presentation/assento/assentoRoutes.js";
import { catalogRoutes, reviewRoutes } from "./presentation/catalog/catalogRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/cinemas", cinemaRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/filmes", catalogRoutes);
app.use("/avaliacoes", reviewRoutes);
app.use("/sessions", sessionRoutes);
app.use("/combos", comboRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/sessions/:id/ingressos", ingressoRoutes);
app.use("/salas", salaRoutes);
app.use("/assentos", assentoRoutes);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
