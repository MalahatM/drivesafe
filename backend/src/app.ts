import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

//start the server by reading port from env
 const port = process.env.PORT || 3700;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
