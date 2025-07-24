import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyFirebaseToken } from "./verifyFirebaseToken.js";
import { createClient } from "@supabase/supabase-js";
import supabase from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- /api/notes endpoints ---
const router = express.Router();

// POST /api/notes (create note)
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { content, tags, public: isPublic } = req.body;
    const owner_uid = req.user.uid;
    
    // Validate required fields
    if (content === undefined) {
      return res.status(400).json({ error: "Content is required" });
    }
    
    const { data, error } = await supabase
      .from("notes")
      .insert([{ 
        content: content || '', 
        tags: tags || [], 
        public: isPublic || false, 
        owner_uid 
      }])
      .select()
      .single();
    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

// GET /api/notes/:id (read note, check permissions)
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return res.status(404).json({ error: "Note not found" });
  
  // Check if user can access this note
  if (!data.public && (!req.user || req.user.uid !== data.owner_uid)) {
    return res.status(403).json({ error: "Forbidden" });
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

// PATCH /api/notes/:id (partial update for auto-save)
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};
    
    // Only include fields that are provided in the request
    if (req.body.content !== undefined) updateFields.content = req.body.content;
    if (req.body.tags !== undefined) updateFields.tags = req.body.tags;
    if (req.body.public !== undefined) updateFields.public = req.body.public;
    
    // Validate that we have something to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    // Only owner can update
    const { data: note, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchError || !note) {
      console.error("Note fetch error:", fetchError);
      return res.status(404).json({ error: "Note not found" });
    }
    if (note.owner_uid !== req.user.uid)
      return res.status(403).json({ error: "Forbidden" });
      
    const { data, error } = await supabase
      .from("notes")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Update error:", error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
  console.log(`CORS enabled for: http://localhost:5173`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`Supabase Service Role Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
});
