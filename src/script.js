const apiKey = 'b31738b39a9616ae7b1e0f4528fb1985';
let currentActivePage = 1;

function onPageNumberClick(url) {
  $('.pageButtons').on('click', function (e) {
    let sliceStart = $(this).val();
    let page = 1;
    const currentpage = parseInt($(this).html(), 10);
    currentActivePage = currentpage;
    if (currentpage !== 1 && currentpage !== 2) {
      if (currentpage % 2 !== 0) {
        page = currentpage - 1;
        fetchResults(url, sliceStart, page);
      }
      if (currentpage % 2 === 0) {
        page = currentpage - 2;

        fetchResults(url, sliceStart, page);
      }
    }
    if (currentpage <= 2) {
      page = 1;
      sliceStart = (currentpage - 1) * 10;
      fetchResults(url, sliceStart, page);
    }
  });
}

// create page buttons
function createButtons(url, totalPage) {
  let sliceStart = 0;
  const movieResultsContainer = $('.search-results');
  const paginationContainer = $('.pagination-container');
  movieResultsContainer.empty();
  paginationContainer.empty();
  let totalPages = totalPage;
  const maxVisibleButtons = 5;
  const currentPage = currentActivePage;
  if (totalPage > 500) {
    totalPages = 500;
  }
  if (totalPage > 1 && totalPages !== 1) {
    if (totalPages > maxVisibleButtons) {
      let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
      const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

      if (endPage - startPage < maxVisibleButtons) {
        startPage = endPage - maxVisibleButtons + 1;
      }

      if (startPage > 1) {
        const firstPageButton = $('<button>').addClass('pageButtons').attr('value', 0).html('1');
        paginationContainer.append(firstPageButton);
      }

      if (startPage > 2) {
        const ellipsisStart = $('<span>').html('...');
        paginationContainer.append(ellipsisStart);
      }

      for (let i = startPage; i <= endPage; i += 1) {
        sliceStart = 0;
        if (i % 2 === 0) {
          sliceStart += 10;
        }
        const pageSelect = $('<button>').addClass('pageButtons').attr('value', sliceStart).html(i);

        if (i === currentPage) {
          pageSelect.addClass('active-page');
        }
        paginationContainer.append(pageSelect);
      }

      if (endPage < totalPages - 1) {
        const ellipsisEnd = $('<span>').html('...');
        paginationContainer.append(ellipsisEnd);
      }

      if (endPage < totalPages) {
        const lastPage = totalPages;
        sliceStart = 0;
        if (totalPages % 2 === 0) {
          sliceStart += 10;
        }
        const lastPageButton = $('<button>').addClass('pageButtons').attr('value', sliceStart).html(lastPage);
        paginationContainer.append(lastPageButton);
      }
    } else {
      for (let i = 1; i <= totalPages; i += 1) {
        sliceStart = 0;
        if (i % 2 === 0) {
          sliceStart += 10;
        }
        const pageSelect = $('<button>').addClass('pageButtons').attr('value', sliceStart).html(i);
        if (i === currentPage) {
          pageSelect.addClass('activePage');
        }
        paginationContainer.append(pageSelect);
      }
    }
  }
  onPageNumberClick(url);
}

// displays the results returned by api
function displayResults(results, sliceStart) {
  const movieResultsContainer = $('.search-results');

  const slicedResult = results.slice(sliceStart, sliceStart + 10);
  if (slicedResult.length === 0) {
    alert('No Results!!!');
    movieResultsContainer.empty();
    const paginationContainer = $('.pagination-container');
    paginationContainer.empty();
  } else {
    slicedResult.forEach((movie) => {
      const imageBaseUrl = 'http://image.tmdb.org/t/p/';
      const posterPath = movie.poster_path;
      const imageSource = posterPath ? `${imageBaseUrl}w154${posterPath}` : 'placeholder-image-url.jpg';
      const {
        title,
      } = movie;
      const movieId = movie.id;
      if (posterPath) {
        const movieContainer = $('<div>').addClass('movie-container');
        movieContainer.empty();
        const imageElement = $(`<img data-movie-id="${movieId}">`).addClass('movie-image').attr('src', imageSource);
        const titleElement = $(`<p class="movie-title" data-movie-id="${movieId}">`).text(title);
        movieContainer.append(imageElement);
        movieContainer.append(titleElement);
        movieResultsContainer.append(movieContainer);
      }
    });
  }
}

// fetches the results based on the search query or the filters
function fetchResults(url, sliceStart, page) {
  const finalUrl = `${url}&page=${page}`;
  $.ajax({
    url: finalUrl,
    datatype: 'json',
    success(data) {
      const {
        results,
      } = data;
      const totalResultsLength = Math.round((data.total_results / 10) / 2);
      createButtons(url, totalResultsLength);
      displayResults(results, sliceStart);
    },
    error(error) {
      console.error('Error fetching data:', error);
      alert('No results');
    },
  });
}

function filterByGenre(selectedGenre, currentPage) {
  if (selectedGenre) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}`;
    fetchResults(url, 0, currentPage);
    const moreFilters = document.querySelector('.more-filters');
    moreFilters.style.display = 'none';
  }
}

const moreElement = document.querySelector('#more');
moreElement.addEventListener('click', () => {
  const moreFilters = document.querySelector('.more-filters');
  moreFilters.style.display = 'block';
});

$('.sort').on('click', function () {
  const currentPage = 1;
  currentActivePage = 1;
  const genre = Math.round($(this).attr('value'));
  filterByGenre(genre, currentPage);
});

$('.filter-options').on('click', function () {
  const currentPage = 1;
  currentActivePage = 1;
  const genre = $(this).attr('value');
  filterByGenre(genre, currentPage);
});

$(document).on('click', '.movie-title, .movie-image', function () {
  const movieId = $(this).data('movie-id');
  window.location.href = `detail.html?id=${movieId}`;
});

$('#carousel').on('click', () => {
  const moreFilters = document.querySelector('.more-filters');
  moreFilters.style.display = 'none';
});

$('#searchButton').click((e) => {
  e.preventDefault();
  const searchQuery = $('#searchInput').val();
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;
  fetchResults(url, 0, 1);
});