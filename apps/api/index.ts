import "dotenv/config";
import express from "express";
import { connectDatabase } from "./src/connection";
import router from "./src/routes";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  connectDatabase();
  console.log("Server + Database running!");
});
