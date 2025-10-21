import express from "express";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../data/dynamo.js";
import { registerSchema } from "../validation/userValidation.js"; 
import { ZodError } from "zod";
import { randomUUID } from "crypto";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password, userscar } = req.body;

  try {
    //  validate input data
    registerSchema.parse({ username, email, password, userscar });
  } catch (err) {
   if (err instanceof ZodError) {
  const message = err.issues?.[0]?.message || "Validation failed";
  return res.status(400).json({ error: message });
}
  
  }

  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        pk: `USER#${username}`,
        sk: `PROFILE#${username}`,
        id: randomUUID(),
        username,
        email,
        password,
        userscar,
      },
    });

    await db.send(command);
    res.status(201).json({ message: "User registered successfully", username, email });
  } catch (error) {
    console.error("DynamoDB Error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;
