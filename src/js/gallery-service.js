import Notiflix from 'notiflix';
const axios = require('axios').default;

const API_KEY = '34735624-4b76f542e0da2b11ccd2d9be8';
const BASE_URL = 'https://pixabay.com/api/';

export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    try {
      const searchParams = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.per_page,
        page: this.page,
      });

      const fetch = await axios.get(`${BASE_URL}?${searchParams}`);

      this.incrementPage();
      return fetch;
    } catch (error) {
      console.log(error);
    }
  }

  emptyArray() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.log('Empty array. No photos found!');
  }

  emptySearchField() {
    Notiflix.Notify.info(
      'The search field cannot be empty. Please enter a query and try again.'
    );
  }

  finalyPage() {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  totalImagesFound(total) {
    Notiflix.Notify.success(`Hooray! We found ${total} images.`);
  }

  incrementPage() {
    this.page += 1;
  }

  resetNumberPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
