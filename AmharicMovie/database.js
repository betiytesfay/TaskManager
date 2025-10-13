const { MongoClient } = require('mongodb');

// Paste your full connection string here
const uri = "mongodb+srv://amharic_mov:%2Bq%40H3c9Dfd%214DC7@cluster0.fhnckyx.mongodb.net/amharicMoviesDB?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('amharicMoviesDB');
    const movies = database.collection('movies');

    // Example: Add one movie document
    const movieDoc = {
      title: "Sample Movie",
      description: "This is a test movie description",
      thumbnail: "https://example.com/sample-thumbnail.jpg",
      year: 2023,
      genre: "Drama"
    };

    const result = await movies.insertOne(movieDoc);
    console.log(`Movie inserted with ID: ${result.insertedId}`);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
