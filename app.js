const express = require('express')
const app = express()
const path = require('path')
const bp = require('body-parser')
const bep = bp.urlencoded({extended:false})
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url)
const cors = require('cors');

app.use(cors());
app.use(express.json());

client.connect();
console.log("connected....")
const db = client.db('dbname')
const col = db.collection('colle')

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

app.get('/', async (req, res) => {
    try {
      console.log('GET request');
      const fr = await col.find({}).toArray();

      res.json(fr);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred');
    }
  });

app.post('/',bep,async(req,res)=>{
    let x = {fname:req.body.fname,lname:req.body.lname}
    res.send(x)
    const ir = await col.insertOne(x);
    console.log(ir);
})

app.put('/', async (req, res) => {
  try {
    const {fname, newFname} = req.body;
    const result = await col.updateOne({ fname }, { $set: { fname: newFname } });
    if (result.matchedCount === 0) {
      res.status(404).send('First name not found');
    } else {
      res.send(`Document updated: ${fname} -> ${newFname}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});
app.delete('/', async (req, res) => {
  try {
    const { fname } = req.body;
    const result = await col.deleteOne({ fname });
    if (result.deletedCount === 0) {
      res.status(404).send('First name not found');
    } else {
      res.send(`Document deleted: ${fname}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

 app.listen(8080,()=>{
    console.log('server runs on http://127.0.0.1:8080')
 })