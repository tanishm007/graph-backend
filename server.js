const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3002;

// MongoDB Connection (Replace with your MongoDB connection string)
const mongoDBConnectionString = 'mongodb+srv://tanishmahajanm:tanish007@cluster0.51epja8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define your dataset schema and model here
// ...

const datasetSchema = new mongoose.Schema({

    date: { type: String, required: true }, 
    a: { type: Number, required: true },
    b: { type: Number, required: true },
    c: { type: Number, required: true },
    d: { type: Number, required: true },
    e: { type: Number, required: true }
})

 const Dataset = mongoose.model('Dataset', datasetSchema);

 const datasetbarSchema = new mongoose.Schema({
    date: { type: String, required: true },
    e: { type: Number, required: true },
    f: { type: Number, required: true }, 
    h: { type: Number, required: true } 
    
});

const Datasetbar = mongoose.model('Datasetbar', datasetbarSchema);

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 

// API Endpoint: '/api/dataset'
app.post('/api/dataset', (req, res) => {
  const newDatasetEntry = new Dataset(req.body); // Assuming 'Dataset' is your model




  newDatasetEntry.save()
    .then(savedEntry => res.json(savedEntry))
    .catch(err => res.status(500).json({ error: err }));
});

app.put('/api/dataset', (req, res) => { 
    const date = req.query.date; // Get date from query parameters
    const updatedData = req.body;

    Dataset.findOneAndUpdate({ date: date }, updatedData, { new: true }) 
        .then(updatedEntry => res.json(updatedEntry))
        .catch(err => res.status(500).json({ error: err }));
});

app.delete('/api/dataset', (req, res) => {
    const date = req.query.date; 

    Dataset.findOneAndDelete({ date: date })
        .then(deletedEntry => res.json(deletedEntry))
        .catch(err => res.status(500).json({ error: err }));
});


app.post('/api/datasetbar', (req, res) => {
    const newDatasetbarEntry = new Datasetbar(req.body);

    newDatasetbarEntry.save()
        .then(savedEntry => res.json(savedEntry))
        .catch(err => res.status(500).json({ error: err }));
});

app.put('/api/datasetbar', (req, res) => {
    const date = req.query.date;
    const updatedData = req.body;

    Datasetbar.findOneAndUpdate({ date: date }, updatedData, { new: true })
        .then(updatedEntry => res.json(updatedEntry))
        .catch(err => res.status(500).json({ error: err }));
});

app.delete('/api/datasetbar', (req, res) => {
    const date = req.query.date;

    Datasetbar.findOneAndDelete({ date: date })
        .then(deletedEntry => res.json(deletedEntry))
        .catch(err => res.status(500).json({ error: err }));
});


app.get('/api/dataset', async (req, res) => {
    try {
        const allDatasetEntries = await Dataset.find({}); 
        res.json(allDatasetEntries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.get('/api/datasetbar', async (req, res) => {
    try {
        const allDatasetbarEntries = await Datasetbar.find({});
        res.json(allDatasetbarEntries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
