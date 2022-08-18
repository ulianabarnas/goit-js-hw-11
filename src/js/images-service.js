import axios from 'axios';
import { Notify } from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '14611902-cba6e6d3c19977a925f1406cc';

export default class ImagesApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  async getImages() {
    const filters = `key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const { data } = await axios.get(`${BASE_URL}?${filters}`);
    console.log(data);

    debugger;
    const totalHits = data.totalHits;

    const totalPages = Math.ceil(totalHits / 40);

    if (this.page > totalPages) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return null;
    }

    this.page += 1;

    return data;
  }

  resetPage() {
    this.page = 1;
  }
}
