const apiKey = 'b31738b39a9616ae7b1e0f4528fb1985';
let genreClicked = false
let genreName = 0;

function fetchData(urlFinal) {
    $.ajax({
        url: urlFinal,
        type: 'GET',
        dataType: 'json',
        success(data) {


            pagination(data);

        }
    });
}

function getSearchQuery(apiKey) {
    const query = $('#searchBox').val();

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    fetchData(url);
}

$("#searchButton").click(function (e) {
    e.preventDefault();
    getSearchQuery(apiKey);
});

function filterResultsByTitle(results) {
    const query = $('#searchBox').val().toLowerCase();
    return results.filter(movie => movie.title.toLowerCase().includes(query));
}

function displayResults(data) {
    const movieResultsContainer = $('.search-results');
    movieResultsContainer.empty();

    if (data.length === 0) {
        movieResultsContainer.text("No results found.");
    } else {
        data.forEach(movie => {
            const imageBaseUrl = 'http://image.tmdb.org/t/p/';
            const posterPath = movie.poster_path;
            const imageSource = posterPath ? `${imageBaseUrl}w154${posterPath}` : 'placeholder-image-url.jpg';
            const movieContainer = $('<div>').addClass('movie-container');
            const title = movie.title;
            if (posterPath) {
                const imageElement = $('<img>').attr('src', imageSource);
                const titleElement = $('<p>').text(title);
                movieContainer.append(imageElement);
                movieContainer.append(titleElement);
            }

            movieResultsContainer.append(movieContainer);
        });
    }
    
        data.forEach(movie => {
            const imageBaseUrl = 'http://image.tmdb.org/t/p/';
            const posterPath = movie.poster_path;
            const imageSource = posterPath ? `${imageBaseUrl}w154${posterPath}` : 'placeholder-image-url.jpg';
            const movieContainer = $('<div>').addClass('movie-container');
            const title = movie.title;
    
            if (posterPath) {
                const imageElement = $('<img>').attr('src', imageSource);
                const titleElement = $('<p>').text(title);
    
                const detailLink = $('<a>').attr('href', `detail.html?title=${title}`).append(imageElement, titleElement);
    
                movieContainer.append(detailLink);
            }
    
            movieResultsContainer.append(movieContainer);
        });
    }
    
// Sort function
$('.sort').on('click', function () {
    genreClicked = true
    genre = $(this).attr('value');
    console.log(genre)
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
    fetchData(url);
});

function pagination(data) {

    const slicedResult = data.results.slice(0, 5);
    if (genreClicked) {
        displayResults(slicedResult)

        genreClicked = false
    }
    const filteredTitleResult = filterResultsByTitle(slicedResult);
    displayResults(filteredTitleResult)
    const movieResultsContainer = $('.search-results')
    totalPages = data.results.length / 10;

    const pageNumberDiv = $('<div>').addClass('page-number-div').css('display', 'inline');
    for (let i = 1; i <= totalPages; i++) {
        const pageSelect = $('<button>').addClass('pageButtons btn btn-secondary px-2 py-1').attr('value', i).html(i);

        pageNumberDiv.append(pageSelect)
    }
    $(document.body).append(pageNumberDiv)
}

const moreElement = document.querySelector('#more'); 
moreElement.addEventListener('click', function() {
    const moreFilters = document.querySelector('.more-filters'); 
    moreFilters.style.display = 'block';
});

$('.filter-options').on('click', function () {
    genreClicked = true
    genre = $(this).attr('value');
    console.log(genre)
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
    fetchData(url);
    const moreFilters = document.querySelector('.more-filters'); 
    moreFilters.style.display = 'none';
});

$('#myCarousel').on('click', function () {
    const moreFilters = document.querySelector('.more-filters');
    moreFilters.style.display = 'none';
});