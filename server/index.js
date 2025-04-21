// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicine-reminder')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Reminder Schema
const reminderSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  time: { type: String, required: true }, // HH:MM format
  notes: { type: String },
  taken: { type: Boolean, default: false }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

// API Routes
// Get all reminders
app.get('/api/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new reminder
app.post('/api/reminders', async (req, res) => {
  const reminder = new Reminder({
    medicineName: req.body.medicineName,
    time: req.body.time,
    notes: req.body.notes
  });

  try {
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a reminder (mark as taken)
app.patch('/api/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    if (req.body.taken !== undefined) reminder.taken = req.body.taken;
    
    const updatedReminder = await reminder.save();
    res.json(updatedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a reminder
app.delete('/api/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});