import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import rankRouter from "./routes/rankRoutes.js";
import analysisRouter from "./routes/analysisRoutes.js";

console.log("BROWSERBASE_API_KEY:", process.env.BROWSERBASE_API_KEY);
connectDB()
const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.get('/',(req,res)=> res.send("Server is running"))
app.use("/api/auth",authRouter)
app.use("/api/rank",rankRouter)
app.use('/api/analysis',analysisRouter)

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))