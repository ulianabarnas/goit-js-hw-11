export default function getRefs() {
  return {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    galleryContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
  };
}
