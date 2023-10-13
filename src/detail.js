$(document).ready(function() {
    const queryParams = new URLSearchParams(window.location.search);
    const title = queryParams.get('title');
    const apiKey = 'b31738b39a9616ae7b1e0f4528fb1985';
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`;

    // Selectors
    const $backdrop = $('#backdrop');
    const $sidedrop = $('#sidedrop');
    const $titleValue = $('#titleValue');
    const $originalTitleValue = $('#originalTitleValue');
    const $adultValue = $('#adultValue');
    const $releaseDateValue = $('#releaseDateValue');
    const $averageVoting = $('#averageVoting');
    const $totalVoting = $('#totalVoting');
    const $popularity = $('#popularity');
    const $idValue = $('#idValue');
    const $overviewValue = $('#overviewValue');
    const $originalLanguageValue = $('#originalLanguageValue');

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success(data) {
            const movie = data.results[0];

            if (movie) {
                if (movie.poster_path) {
                    const posterPathUrl = `http://image.tmdb.org/t/p/original${movie.poster_path}`;
                    $backdrop.attr('src', posterPathUrl);
                } else {
                    console.error('No backdrop path available.');
                }

                if (movie.backdrop_path) {
                    const sidedropPathUrl = `http://image.tmdb.org/t/p/original${movie.backdrop_path}`;
                    $sidedrop.attr('src', sidedropPathUrl);
                } else {
                    console.error('No backdrop path available for sidedrop.');
                }

                $originalTitleValue.text(movie.original_title);
                $titleValue.text(movie.title);
                $adultValue.text(movie.adult ? 'Yes' : 'No');
                $releaseDateValue.text(movie.release_date);
                $averageVoting.text(movie.vote_average);
                $totalVoting.text(movie.vote_count);
                $popularity.text(movie.popularity);
                $idValue.text(movie.id);
                $overviewValue.text(movie.overview);
                $originalLanguageValue.text(movie.original_language);

            } else {
                console.error('No movie details available.');
            }
        },
        error(error) {
            console.error('Error fetching movie details:', error);
        }
    });
});
