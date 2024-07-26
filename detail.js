const API_KEY = '40aa32f398385becf4957c01e2802018';
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch movie details
function fetchMovieDetails(movieId) {
  fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(movie => {
      document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      document.getElementById('movieTitle').textContent = movie.title;
      document.getElementById('movieOverview').textContent = movie.overview;
      document.getElementById('score').textContent = movie.vote_average;
      document.getElementById('releaseDate').textContent = movie.release_date;
      document.getElementById('originalLanguage').textContent = movie.original_language;
      document.getElementById('budget').textContent = movie.budget;
      document.getElementById('revenue').textContent = movie.revenue;
      fetchCast(movieId);
      fetchReviews(movieId);
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch cast
function fetchCast(movieId) {
  fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const castList = document.getElementById('castList');
      castList.innerHTML = '';
      data.cast.slice(0, 10).forEach(cast => {
        const castItem = document.createElement('div');
        castItem.classList.add('castItem');
        castItem.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${cast.profile_path}" alt="${cast.name}">
                              <p>${cast.name} <br> (${cast.character})</p>`;
        castList.appendChild(castItem);
      });
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch reviews
function fetchReviews(movieId) {
  fetch(`${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const reviewsList = document.getElementById('reviewsList');
      reviewsList.innerHTML = '';
      data.results.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('reviewItem');
        reviewItem.innerHTML = `<h4>${review.author}</h4>
                                <p>${review.content}</p>`;
        reviewsList.appendChild(reviewItem);
      });
    })
    .catch(error => console.error('Error:', error));
}

// Fetch movie details on page load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('movieId'); // Make sure parameter name matches URL
  if (movieId) {
    fetchMovieDetails(movieId);
  } else {
    console.error('Movie ID not found in URL');
  }
});
