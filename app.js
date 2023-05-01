import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import todoRouter from "./routes/todoRoutes.js";

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

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
  console.log(`server is running on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
