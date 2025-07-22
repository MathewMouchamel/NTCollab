import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyFirebaseToken } from "./verifyFirebaseToken.js";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- /api/notes endpoints ---
const router = express.Router();

// POST /api/notes (create note)
router.post("/", verifyFirebaseToken, async (req, res) => {
  const { content, tags, public: isPublic } = req.body;
  const owner_uid = req.user.uid;
  const { data, error } = await supabase
    .from("notes")
    .insert([{ content, tags, public: isPublic, owner_uid }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/notes (list notes for current user)
router.get("/", verifyFirebaseToken, async (req, res) => {
  const owner_uid = req.user.uid;
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("owner_uid", owner_uid)
    .order("created_at", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/notes/:id (read note, public/private logic)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return res.status(404).json({ error: "Note not found" });
  // If note is public, allow anyone; if private, only owner
  if (!data.public) {
    // Check auth
    try {
      await verifyFirebaseToken(req, res, () => {});
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!req.user || req.user.uid !== data.owner_uid) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }
  res.json(data);
});

// PUT /api/notes/:id (update note)
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { content, tags, public: isPublic } = req.body;
  // Only owner can update
  const { data: note, error: fetchError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !note)
    return res.status(404).json({ error: "Note not found" });
  if (note.owner_uid !== req.user.uid)
    return res.status(403).json({ error: "Forbidden" });
  const { data, error } = await supabase
    .from("notes")
    .update({ content, tags, public: isPublic })
    .eq("id", id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/notes/:id (delete note)
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  // Only owner can delete
  const { data: note, error: fetchError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !note)
    return res.status(404).json({ error: "Note not found" });
  if (note.owner_uid !== req.user.uid)
    return res.status(403).json({ error: "Forbidden" });
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

app.use("/api/notes", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
