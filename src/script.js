const apiKey = 'b31738b39a9616ae7b1e0f4528fb1985';
let currentPage = 1;
let allResults = []; // To store results from all pages
let genreClicked = false;
let genre = null;
let selectedPage = 1;

// Function to update the UI and fetch movies based on the selected genre
function filterByGenre(selectedGenre, currentPage) {
    if (selectedGenre) {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}`;
        fetchData(url, currentPage, selectedPage);
    }
}

function pagination(results, currentPage, url, length, selectedPage) {
    const movieResultsContainer = $('.search-results');

    movieResultsContainer.empty();

    const totalPages = Math.ceil(length / 10);
    console.log(totalPages)

    const start = (selectedPage - 1) * 10;
    const end = Math.min(start + 10, results.length);

    const slicedResult = results.slice(start, end);
    displayResults(slicedResult);
    console.log(slicedResult, 'slice')
    const buttonsToShow = 5;

    if (totalPages > 1) {
        for (let i = 1; i < totalPages; i++) {
            const pageSelect = $('<button>').addClass('pageButtons btn btn-secondary px-2 py-1').attr('value', i).html(i);

            if (i === currentPage) {
                pageSelect.addClass('activePage');
            }

            if (i <= buttonsToShow || i === totalPages) {
                movieResultsContainer.append(pageSelect);
            } else if (i == buttonsToShow + 1) {
                const ellipsis = $('<span>').html('...');
                movieResultsContainer.append(ellipsis);
            }
        }
        buttonCall(url);
    } else {
        displayResults(results);
    }
}

function buttonCall(url) {
    $('.pageButtons').on('click', function (e) {
        const selectedPage = Math.ceil($(this).attr('value'));

        if (currentPage !== selectedPage) {
            if (selectedPage > 2) {
                currentPage = (Math.ceil((selectedPage / 2)));
                console.log(currentPage, 'cyrre')
                fetchData(url, currentPage, selectedPage)
            }
        }
        if (selectedPage == 1 || selectedPage == 2) {
            fetchData(url, 1, selectedPage)
        }
    });
}

function fetchData(url, page, selectedPage) {
    finalUrl = url + `&page=${page}`;
    console.log(finalUrl)
    $.ajax({
        url: finalUrl,
        dataType: 'json',
        success: function (data) {
            const results = data.results;
            allResults = allResults.concat(results);
            pagination(allResults, page, url, data.total_pages, selectedPage);

        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}


function displayResults(slicedResult) {
    const movieResultsContainer = $('.search-results');

    if (slicedResult.length === 0) {
        movieResultsContainer.text("No results found.");
        return;
    } else {
        movieResultsContainer.empty(); // Clear existing results
        slicedResult.forEach(movie => {
            const imageBaseUrl = 'http://image.tmdb.org/t/p/';
            const posterPath = movie.poster_path;
            const imageSource = posterPath ? `${imageBaseUrl}w154${posterPath}` : 'placeholder-image-url.jpg';
            const title = movie.title;
            const movieId = movie.id;
            if (posterPath) {
                const movieContainer = $('<div>').addClass('movie-container');
                movieContainer.empty();
                const imageElement = $('<img>').attr('src', imageSource);
                const titleElement = $(`<p class="movie-title" data-movie-id="${movieId}">`).text(title);
                movieContainer.append(imageElement);
                movieContainer.append(titleElement);
                movieResultsContainer.append(movieContainer);
            }
        });
    }
}

$("#searchButton").click(function (e) {
    e.preventDefault();
    let currentPage = 1; // Reset the current page when searching
    allResults = []; // Reset the results
    const searchQuery = $('#searchInput').val();
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;
    fetchData(url, currentPage);
});

$(document).on('click', '.movie-title', function () {
    const movieId = $(this).data('movie-id');
    // Open the movie-details.html page with the movie ID as a query parameter
    window.location.href = `movie-details.html?id=${movieId}`;
});

// Click event for the "More" button
const moreElement = document.querySelector('#more');
moreElement.addEventListener('click', function () {
    let currentPage = 1; // Reset current page
    if (genre) {
        fetchData(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`, currentPage);
    }
});


$('.sort').on('click', function () {
    currentPage = 1; // Reset current page
    genreClicked = true;
    genre = Math.round($(this).attr('value'));
    filterByGenre(genre, currentPage); // Fetch data with the selected genre

});

$('.filter-options').on('click', function () {
    const searchQuery = $('#searchInput').val();
    if (searchQuery.trim() !== "") {
        let currentPage = 1; // Reset current page
        genreClicked = true;
        genre = $(this).attr('value');
        filterByGenre(genre, currentPage);
    }
});