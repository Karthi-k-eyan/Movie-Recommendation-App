//script.js

const API_KEY = '40aa32f398385becf4957c01e2802018';
const BASE_URL = 'https://api.themoviedb.org/3';
const genresSelect = document.getElementById('genres');
const playBtn = document.getElementById('playBtn');
const likeBtn = document.getElementById('likeBtn');
const movieList = document.getElementById('movieList');
const likeOrDislikeBtns = document.getElementById('likeOrDislikeBtns');

let currentGenreId = null;
let movies = [];
let currentMoviePage = 1;
let currentMovieIndex = 0;

// Function to fetch genres
function fetchGenres() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`, true);
  xhr.onload = function () {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText);
      const genres = response.genres;
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genresSelect.appendChild(option);
      });
    }
  };
  xhr.send();
}

// Function to fetch movies of a particular genre
function fetchMoviesByGenre(genreId, page = 1) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`, true);
  xhr.onload = function () {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText);
      movies = response.results;
      displayMovies();
    }
  };
  xhr.send();
}

// Function to display movies
function displayMovies() {
  movieList.innerHTML = '';
  if (movies.length > 0) {
    movies.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movieItem');
      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movieItem.innerHTML = `<img src="${posterUrl}" alt="${movie.title}" data-id="${movie.id}">
                             <h2>${movie.title}</h2>
                             <p>${movie.overview}</p>`;
      movieItem.querySelector('img').addEventListener('click', function () {
        window.location.href = `detail.html?movieId=${this.dataset.id}`;
      });
      movieList.appendChild(movieItem);
    });
    movieList.hidden = false;
    likeOrDislikeBtns.hidden = false;
  } else {
    movieList.innerHTML = '<p>No movies found for this genre.</p>';
    movieList.hidden = false;
    likeOrDislikeBtns.hidden = true;
  }
}

// Event listener for the play button
playBtn.addEventListener('click', () => {
  const selectedGenreId = genresSelect.value;
  if (selectedGenreId) {
    currentGenreId = selectedGenreId;
    currentMoviePage = 1;
    fetchMoviesByGenre(selectedGenreId, currentMoviePage);
  }
});

// Event listener for the next button
likeBtn.addEventListener('click', () => {
  if (movies.length > 0) {
    currentMoviePage++;
    fetchMoviesByGenre(currentGenreId, currentMoviePage);
  }
});

// Fetch genres on page load
fetchGenres();
