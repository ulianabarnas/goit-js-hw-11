import axios from 'axios';

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
    const { totalHits } = data;

    const totalPages = Math.ceil(totalHits / 40);

    if (this.page > totalPages && totalHits !== 0) {
      return null;
    }

    data.page = this.page;

    this.page += 1;

    return data;
  }

  resetPage() {
    this.page = 1;
  }
}
