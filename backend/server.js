const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri ='mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern' ;
const client = new MongoClient(uri);

app.post('/add-movie', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Clusters');
    const collection = database.collection('movies');
    const movieDataArray = req.body;
    const result = await collection.insertMany(movieDataArray);
    res.status(201).send(`Movies added with IDs: ${result.insertedIds}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding movies');
  } finally {
    await client.close();
  }
});
app.get('/movies', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('Clusters');
      const collection = database.collection('movies');
      const movies = await collection.find({}).toArray();
      res.status(200).json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching movies');
    } finally {
      await client.close();
    }
  });

  app.patch('/update-movie/:movieName', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('Clusters');
      const collection = database.collection('movies');
  
      const movieName = req.params.movieName;
      const imageUrl = req.body.imageUrl;
  
      const result = await collection.updateOne(
        { movieName: movieName },
        { $set: { imageUrl: imageUrl } }
      );
  
      if (result.modifiedCount > 0) {
        res.send(`Image URL added for movie: ${movieName}`);
      } else {
        res.send(`No movie found with name: ${movieName}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating movie image');
    } finally {
      await client.close();
    }
  });


  app.patch('/update-movie/:movieName', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('Clusters');
      const collection = database.collection('movies');
  
      const movieName = req.params.movieName;
      const newImageUrl = req.body.imageUrl;
  
      const result = await collection.updateOne(
        { movieName: movieName },
        { $set: { imageUrl: newImageUrl } }
      );
  
      if (result.modifiedCount > 0) {
        res.send(`Image URL updated for movie: ${movieName}`);
      } else {
        res.send(`No movie found with name: ${movieName}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating movie image URL');
    } finally {
      await client.close();
    }
  });
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });



