import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/images-service.js';
import getRefs from './js/get-refs.js';

const refs = getRefs();

const imagesApiService = new ImagesApiService();

refs.form.addEventListener('submit', onSearchBtn);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearchBtn(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  hideLoadMoreBtn();
  clearGalleryContainer();

  if (imagesApiService.query === '') {
    Notify.info('Please fill the field.');
    return;
  }

  imagesApiService.resetPage();

  const isSerched = true;
  renderPhotoCard(isSerched);
}

async function renderPhotoCard(isSerched = false) {
  try {
    const data = await imagesApiService.getImages();
    const { hits, totalHits, page } = data;
    if (data === null) return;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (isSerched) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    const markup = hits
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

    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);

    showLoadMoreBtn();
    new SimpleLightbox('.gallery a', {
      scrollZoom: false,
    });

    if (page * 40 >= totalHits) {
      hideLoadMoreBtn();

      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtn() {
  const isSerched = false;
  await renderPhotoCard(isSerched);
  smoothScroll();
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
