import { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import MovieCard from "./MovieCard";
import { movies } from "./data";
import { genres, moods, languages } from "./constants";
import { API_KEY } from "./config";


export default function App() {
  // Save User Choice
  const [age, setAge] = useState("");
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");

  // AI message
  const [aiMessage, setAiMessage] = useState("");

  // Movie Card
  const [movieResult, setMovieResult] = useState([]);

  // Recommendation of Movies
  async function recommendMovie() {
    // remove emoji from genre
    let cleanGenre = genre.replace(/[^\w\s]/gi, "").trim();

    // Filter movies
    let filteredMovies = movies.filter(
      (movie) =>
        movie.genre.toLowerCase().includes(cleanGenre.toLowerCase()) &&
        movie.language === language
    );

    setMovieResult(filteredMovies);

    // AI Prompt
    const prompt = `Recommend 5 movies for:
Age: ${age}
Mood: ${mood}
Genre: ${genre}
Language: ${language}

Rules:
1. Do NOT write introduction text.
2. Start directly from movie list.
3. Use numbering.
4. Keep answers short.

Example:
1. Shin chan: The Spicy Kasukabe Dancers in India - Fun animated movie
2. Frozen - Magical adventure`;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      setAiMessage(data.choices[0].message.content);
    } catch (error) {
      console.log(error);
      setAiMessage("CineVerse by Naitik is having server issues");
    }
  }

  return (
    <div>
      <Navbar />
      <HeroSection />

      <div className="container">
        <h1>Find Your Movies in 🎞️NaitiksMovieFinder🍿</h1>

        {/* Age */}
        <select onChange={(e) => setAge(e.target.value)}>
          <option>Select Age</option>
          <option>Kids</option>
          <option>Teen</option>
          <option>Adult</option>
        </select>

        {/* Mood */}
        <select onChange={(e) => setMood(e.target.value)}>
          <option>Select Mood</option>

          {age &&
            moods[age].map((item, index) => (
              <option key={index}>{item}</option>
            ))}
        </select>

        {/* Genre */}
        <select onChange={(e) => setGenre(e.target.value)}>
          <option>Select Genre</option>

          {age &&
            genres[age].map((item, index) => (
              <option key={index}>{item}</option>
            ))}
        </select>

        {/* Language */}
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option>Select Language</option>

          {languages.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>

        <br />
        <br />

        {/* Button */}
        <button onClick={recommendMovie}>🎞️ Recommend a Movie</button>

        {/* AI Section */}
        <div className="ai-box">
          <div className="ai-header">
            <h2>🤖AI Movie Expert</h2>

            <span className="badge">
              SMART RECOMMENDATIONS only on 🎞️NaitiksMovieFinder🍿
            </span>
          </div>

          <div className="ai-content">
            {aiMessage ? (
              aiMessage
                .split(/\d+\.\s/)
                .filter((movie) => movie.trim().length > 20)
                .map((movie, index) => (
                  <div
                    key={index}
                    className="movie-suggestion"
                  >
                    <h3>🎞️ Movie {index + 1}</h3>
                    <p>{movie.trim()}</p>
                  </div>
                ))
            ) : (
              <p className="placeholder">
                🎞️ Choose age, mood, genre and language
                <br />
                <br />
                then Click
                <strong> Recommend Movie</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Movie Cards */}
      <h2>🍿Movie Cards</h2>

      <div className="movie-list">
        {movieResult.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </div>
  );
}