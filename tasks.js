const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
 const collection = client.db("tasks").collection("tasks");

 app.get('/tasks', (req, res) => {
    collection.find().toArray((err, docs) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.json(docs);
      }
    });
 });

 app.post('/tasks', (req, res) => {
    const task = req.body;
    collection.insertOne(task, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.json(result.ops[0]);
      }
    });
 });

 app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;
    collection.updateOne({ _id: new ObjectId(taskId) }, { $set: updatedTask }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.json(result);
      }
    });
 });

 app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    collection.deleteOne({ _id: new ObjectId(taskId) }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.json(result);
      }
    });
 });

 app.listen(3000, () => {
    console.log('Task list app listening on port 3000');
 });

 client.close();
});