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
    const { content, tags, public: isPublic, title } = req.body;
    const owner_uid = req.user.uid;

    // Validate required fields
    if (content === undefined) {
      return res.status(400).json({ error: "Content is required" });
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          content: content || "",
          tags: tags || [],
          public: isPublic || false,
          owner_uid,
          title: title || "",
        },
      ])
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

// POST /api/notes/blank (create blank note)
router.post("/blank", verifyFirebaseToken, async (req, res) => {
  try {
    const owner_uid = req.user.uid;

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          content: "",
          tags: [],
          public: false,
          owner_uid,
          title: "",
        },
      ])
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
  const { uuid, tag } = req.query;

  // If UUID is provided, search for a specific note by UUID
  if (uuid) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("uuid", uuid)
      .eq("owner_uid", owner_uid)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.json(data);
  }

  // Otherwise, return all notes for the user, optionally filtered by tag
  let query = supabase
    .from("notes")
    .select("*")
    .eq("owner_uid", owner_uid)
    .order("last_opened", { ascending: false });
  if (tag) {
    query = query.contains("tags", [tag]);
  }
  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/notes/:id (read note, check permissions)
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;

  // Try to find by UUID first, then by ID
  let query = supabase.from("notes").select("*");

  // Check if the id looks like a UUID (contains hyphens) or is a number
  const isUUID = id.includes("-");

  if (isUUID) {
    query = query.eq("uuid", id);
  } else {
    query = query.eq("id", id);
  }

  const { data, error } = await query.single();
  if (error || !data) return res.status(404).json({ error: "Note not found" });

  // Check if user can access this note
  if (!data.public && (!req.user || req.user.uid !== data.owner_uid)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Update last_opened timestamp
  await supabase
    .from("notes")
    .update({ last_opened: new Date().toISOString() })
    .eq("id", data.id);
  res.json({ ...data, last_opened: new Date().toISOString() });
});

// PUT /api/notes/:id (update note)
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { content, tags, public: isPublic, title } = req.body;

  // Check if the id looks like a UUID or is a number
  const isUUID = id.includes("-");

  // Only owner can update
  let fetchQuery = supabase.from("notes").select("*");
  if (isUUID) {
    fetchQuery = fetchQuery.eq("uuid", id);
  } else {
    fetchQuery = fetchQuery.eq("id", id);
  }

  const { data: note, error: fetchError } = await fetchQuery.single();
  if (fetchError || !note)
    return res.status(404).json({ error: "Note not found" });
  if (note.owner_uid !== req.user.uid)
    return res.status(403).json({ error: "Forbidden" });

  const { data, error } = await supabase
    .from("notes")
    .update({ content, tags, public: isPublic, title })
    .eq("id", note.id) // Always use the numeric ID for updates
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PATCH /api/notes/:id (partial update for auto-save)
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const updateFields = {};

    // Include all fields that are provided in the update request
    updateFields.content = req.body.content;
    updateFields.tags = req.body.tags;
    updateFields.public = req.body.public;
    updateFields.title = req.body.title;

    // Only owner can update
    let fetchQuery = supabase.from("notes").select("*");
    fetchQuery = fetchQuery.eq("uuid", id);

    const { data: note, error: fetchError } = await fetchQuery.single();
    if (fetchError || !note) {
      console.error("Note fetch error:", fetchError);
      return res.status(404).json({ error: "Note not found" });
    }
    if (note.owner_uid !== req.user.uid)
      return res.status(403).json({ error: "Forbidden" });

    const { data, error } = await supabase
      .from("notes")
      .update(updateFields)
      .eq("uuid", note.uuid) // Always use the numeric ID for updates
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

  // Check if the id looks like a UUID or is a number
  const isUUID = id.includes("-");

  // Only owner can delete
  let fetchQuery = supabase.from("notes").select("*");
  if (isUUID) {
    fetchQuery = fetchQuery.eq("uuid", id);
  } else {
    fetchQuery = fetchQuery.eq("id", id);
  }

  const { data: note, error: fetchError } = await fetchQuery.single();
  if (fetchError || !note)
    return res.status(404).json({ error: "Note not found" });
  if (note.owner_uid !== req.user.uid)
    return res.status(403).json({ error: "Forbidden" });
  const { error } = await supabase.from("notes").delete().eq("id", note.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

app.use("/api/notes", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:5173`);
  console.log(
    `Supabase URL: ${
      process.env.SUPABASE_URL ? "Configured" : "NOT CONFIGURED"
    }`
  );
  console.log(
    `Supabase Service Role Key: ${
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "Configured" : "NOT CONFIGURED"
    }`
  );
});
