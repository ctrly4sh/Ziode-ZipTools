import express from "express";
import fileRoutes from "./routes/fileRoutes";
import cors from "cors"

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use("/api", fileRoutes);

app.listen(8900, () => {
  console.log("Server listening at localhost:8900");
})
