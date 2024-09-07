import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import express, { Response, Request } from "express";
import { PORT } from "./config";
import cors from "cors";
const app = express();
import userRouter from "./routes/user";

app.use(express.json());
app.use(cors({ credentials: true }));

app.use("/users", userRouter);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  return res
    .json({
      message: "Perfect Health.",
    })
    .status(200);
});

app.listen(PORT, () => {
  console.log("Listening on PORT:", PORT);
});
