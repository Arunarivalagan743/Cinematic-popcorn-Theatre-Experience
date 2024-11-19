import Movie from '../models/movie'; // Ensure this is the correct path

// Controller to handle POST request to create a movie
export const createMovie = async (req, res) => {
  try {
    const { name, genre, language, cast, screen, timing, summary, imageUrl, ratings } = req.body;
    
    // Create a new movie object
    const newMovie = new Movie({
      name,
      genre,
      language,
      cast,
      screen,
      timing,
      summary,
      imageUrl,
      ratings,
    });

    // Save the new movie to the database
    await newMovie.save();
    res.status(201).json(newMovie); // Return the created movie

  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Failed to insert movie', error: error.message });
  }
};
