import { Notify } from 'notiflix';
import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearchBtn);

function onSearchBtn(e) {
  e.preventDefault();

  const inputValue = e.currentTarget.elements.searchQuery.value.trim();
  //   console.log(inputValue);
  getImages(inputValue);
}

async function getImages(query) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '14611902-cba6e6d3c19977a925f1406cc';
  const filter = `key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;
  try {
    const response = await axios.get(`${BASE_URL}?${filter}`);
    const data = response.data.hits;
    console.log(data);
    renderPhotoCard(data);

    if (data.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function renderPhotoCard(photos) {
  const markup = photos
    .map(photo => {
      return `<div class="photo-card">
  <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${photo.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${photo.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${photo.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${photo.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.galleryContainer.innerHTML = markup;
}
