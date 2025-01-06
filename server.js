
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 


mongoose.connect(process.env.MONGO_URI, {
  
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); 
  });

const app = express();
app.use(express.json());


const dataSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
});

const Data = mongoose.model('Data', dataSchema);


app.get('/', async (req, res) => {
  try {
    const allData = await Data.find();
    res.status(200).json(allData);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving data', error: err });
  }
});


app.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Content is required' });
  }

  const newData = new Data({ content });
  try {
    const savedData = await newData.save();
    res.status(201).json({ message: 'Data saved successfully', data: savedData });
  } catch (err) {
    res.status(500).json({ message: 'Error saving data', error: err });
  }
});


app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const updatedData = await Data.findByIdAndUpdate(id, { content }, { new: true });
    if (!updatedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Data updated successfully', data: updatedData });
  } catch (err) {
    res.status(500).json({ message: 'Error updating data', error: err });
  }
});


app.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedData = await Data.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Data deleted successfully', data: deletedData });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting data', error: err });
  }
});


app.listen(3001, () => {
  console.log("Server running on port 3001");
});
















