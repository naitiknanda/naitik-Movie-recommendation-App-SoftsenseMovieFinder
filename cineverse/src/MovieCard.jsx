export default function MovieCard({movie}){
    return (
        <div className="card">
            <img src={movie.image} alt={movie.name} />
            <h3>{movie.name}</h3>
            <p>🎭 {movie.genre}</p>
            <p>🌏 {movie.language}</p>
        </div>
    );
}