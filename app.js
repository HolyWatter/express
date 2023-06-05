import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import todoRouter from "./src/todo/todo.routes.js";
import cors from "cors";
import commonMiddleware from "./src/common/commonMiddleware.js";
import authRouter from "./src/auth/auth.routes.js";
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.prisma = prisma;
  res.prisma = prisma;
  next();
});

app.use("/api/auth", authRouter);
app.use(commonMiddleware);
app.use("/api/todo", todoRouter);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
