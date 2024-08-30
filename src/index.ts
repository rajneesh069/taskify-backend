import express, { Response, Request } from "express";
import { PORT } from "./config";

const app = express();

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
