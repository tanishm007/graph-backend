const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3002;

// MongoDB Connection (Replace with your MongoDB connection string)
class PolynomialFunction {
    constructor(expression, variables, constants, dependencies) {
        this.expression = expression;
        this.variables = variables;
        this.constants = constants;
  
        this.dependencies = dependencies;
    }


}

const mongoDBConnectionString = 'mongodb+srv://tanishmahajanm:tanish007@cluster0.51epja8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {console.log('Connected to MongoDB')



})


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


const formulaSchema = new mongoose.Schema({
    name: String,
    expression: String,
    dependencies: [String], 
    variables: [String],
    constants: [Number]
 });
 const Formula = mongoose.model('Formula', formulaSchema);


async function addFormulaToMongoDB(name, expression, variables, constants, dependencies) {
    try {
        // Ensure Mongoose is connected (This should happen elsewhere in your application)
        if (mongoose.connection.readyState !== 1) { // 1 means connected
            throw new Error('Mongoose not connected');
        }    

        // Define your formula schema (if not already defined)


        // Create your formula object
        const formula = new PolynomialFunction(expression, variables, constants, dependencies);
        const formulaData = new Formula({
            name: name,
           
            dependencies: formula.dependencies,
            expression: formula.expression,
            variables: formula.variables,
            constants: formula.constants
        });

        // Save the formula to MongoDB
        const savedFormula = await formulaData.save(); 
        console.log(`Formula '${name}' added to MongoDB with ID: ${savedFormula._id}`);
        
       

    } catch (err) {
        console.error('Error adding formula to MongoDB:', err);
     
    }
}




const Datasetbar = mongoose.model('Datasetbar', datasetbarSchema);

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 


app.get('/api/formulas', async (req, res) => {
    try {
      const formulas = await Formula.find({});
      res.json(formulas);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  app.post('/api/formulas', async (req, res) => {
    try {
      const { name, expression, variables, constants, dependencies } = req.body;
  
      // Validation (highly recommended):
      //   * Ensure all expected fields are present.
      //   * Validate the structure of the formula expression.
  
      const formula = new Formula({
        name, 
        expression, 
        variables,
        constants, 
        dependencies
      });
  
      const savedFormula = await formula.save();
      res.status(201).json({ message: 'Formula added', formula: savedFormula }); 
    } catch (err) {
      res.status(500).json({ error: err.message }); 
    }
  });

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
