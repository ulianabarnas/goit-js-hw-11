import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchBtn);
refs.loadMoreBtn.addEventListener('click', onSearchBtn);

function onSearchBtn(e) {
  e.preventDefault();

  const inputValue = e.currentTarget.elements.searchQuery.value.trim();
  console.log(inputValue);
  getImages(inputValue);
}

async function getImages(query) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '14611902-cba6e6d3c19977a925f1406cc';
  let currentPage = 1;
  const filters = `key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;

  if (query === '') {
    Notify.info('Please fill the field.');
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}?${filters}`);
    const data = response.data.hits; //40{}
    const totalHits = response.data.totalHits; //500
    console.log(response);
    console.log(data);

    if (data.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      refs.galleryContainer.innerHTML = '';
      return;
    }

    renderPhotoCard(data);

    new SimpleLightbox('.gallery a', {
      scrollZoom: false,
    });

    Notify.success(`Hooray! We found ${totalHits} images.`);

    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  }
}

function renderPhotoCard(photos) {
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-card" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</a>`;
      }
    )
    .join('');

  refs.galleryContainer.innerHTML = markup;
}

function onLoadMoreBtn() {}

// function clearGalleryContainer() {
//   refs.galleryContainer.innerHTML = "";
// }
