const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: Number,
  gender: String,
  bloodType: String,
  height: Number,
  weight: Number,
  vitals: {
    heartRate: { type: Number, default: 72 },
    temperature: { type: Number, default: 98.6 },
    bloodOxygen: { type: Number, default: 98 },
    steps: { type: Number, default: 8432 },
  },
  organs: {
    heart: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
    lungs: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
    brain: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
    liver: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
    kidneys: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
  },
  allergies: [String],
  medications: [String],
  conditions: [String],
  twinData: {
    type: Object, // Placeholder for 3D digital twin states
    default: {}
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
