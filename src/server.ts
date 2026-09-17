import express from "express";
import verifyRouter from "./routes/verifyRoute.js";

const app = express();
app.use(express.json());

app.use("/api/v1", verifyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sentinel Verification Node running on port ${PORT}`);
});