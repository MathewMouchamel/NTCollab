// Validation middleware
export const validateNoteData = (req, res, next) => {
  const { content, tags, public: isPublic, title } = req.body;
  
  // Validate content
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({ error: 'Content must be a string' });
  }
  
  // Validate tags
  if (tags !== undefined && (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string'))) {
    return res.status(400).json({ error: 'Tags must be an array of strings' });
  }
  
  // Validate public flag
  if (isPublic !== undefined && typeof isPublic !== 'boolean') {
    return res.status(400).json({ error: 'Public field must be a boolean' });
  }
  
  // Validate title
  if (title !== undefined && (typeof title !== 'string' || title.length > 100)) {
    return res.status(400).json({ error: 'Title must be a string with max 100 characters' });
  }
  
  next();
};