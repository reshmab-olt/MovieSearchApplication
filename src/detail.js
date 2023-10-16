const queryParams = new URLSearchParams(window.location.search);
const movieId = queryParams.get('id');
const apiKey = 'b31738b39a9616ae7b1e0f4528fb1985';
const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=b31738b39a9616ae7b1e0f4528fb1985`;

// Selectors
const backdrop = $('#backdrop');
const sidedrop = $('#sidedrop');
const titleValue = $('#titleValue');
const originalTitleValue = $('#originalTitleValue');
const genre = $('#genreValue');
const adultValue = $('#adultValue');
const releaseDateValue = $('#releaseDateValue');
const averageVoting = $('#averageVoting');
const totalVoting = $('#totalVoting');
const popularity = $('#popularity');
const idValue = $('#idValue');
const overviewValue = $('#overviewValue');
const originalLanguageValue = $('#originalLanguageValue');

$.ajax({
    url: apiUrl,
    type: 'GET',
    dataType: 'json',
    success(data) {
        console.log(data);

        const movie = data;
        if (movie) {
            if (movie.poster_path) {
                const posterPathUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
                backdrop.attr('src', posterPathUrl);
            } else {
                console.error('No backdrop path available.');
            }

            if (movie.backdrop_path) {
                const sidedropPathUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
                sidedrop.attr('src', sidedropPathUrl);
            } else {
                console.error('No backdrop path available for sidedrop.');
            }

            titleValue.text(movie.title);
            originalTitleValue.text(movie.original_title);
            adultValue.text(movie.adult ? 'Yes' : 'No');
            releaseDateValue.text(movie.release_date);
            averageVoting.text(movie.vote_average);
            totalVoting.text(movie.vote_count);
            popularity.text(movie.popularity);
            idValue.text(movie.id);
            overviewValue.text(movie.overview);
            originalLanguageValue.text(movie.original_language);
            const genres = movie.genres.map(genre => genre.name).join(', ');
            genre.text(genres);

        } else {
            console.error('No movie details available.');
        }
    },
    error(error) {
        console.error('Error fetching movie details:', error);
    }
});