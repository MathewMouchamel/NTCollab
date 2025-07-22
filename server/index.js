import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyFirebaseToken } from "./verifyFirebaseToken.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Allow CORS from Vite default port
app.use(cors({ origin: "http://localhost:5173" }));

// Endpoint that sends user info if authenticated, or 401 if not
app.get("/protected-test", verifyFirebaseToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { uid, email, picture } = req.user;
  res.json({
    uid,
    email,
    avatar: picture || null,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
