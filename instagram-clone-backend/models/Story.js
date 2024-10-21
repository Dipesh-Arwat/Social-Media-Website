const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  mediaUrl: { type: String, required: true },  
  type: { type: String, enum: ['image', 'video'], required: true }, 
  createdAt: { type: Date, default: Date.now },  
  expiresAt: { type: Date, required: true },  
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  
}, { timestamps: true });


storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);
