import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImegesApiService from './js/gallery-service';
import { renderGallery, clearThePage } from './js/render-gallery';

const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('#search-form'),
  sentinel: document.querySelector('#sentinel'),
};

refs.form.addEventListener(
  'submit',
  throttle(handleFormSubmit, DEBOUNCE_DELAY)
);

const lightbox = new SimpleLightbox('.gallery a', {
  fadeSpeed: DEBOUNCE_DELAY,
});

const imegesApiService = new ImegesApiService();

function handleFormSubmit(e) {
  e.preventDefault();
  imegesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  fetchDataAndRenderPage();
}

async function fetchDataAndRenderPage() {
  if (!imegesApiService.query) {
    imegesApiService.emptySearchField();
    refs.form.reset();
    return;
  }

  clearThePage();
  imegesApiService.resetNumberPage();

  const fetch = await imegesApiService.fetchImages();
  if (fetch.data.total === 0) {
    imegesApiService.emptyArray();
    return;
  }

  imegesApiService.totalImagesFound(fetch.data.totalHits);
  renderGallery(fetch.data.hits);
  observer.observe(refs.sentinel);
  lightbox.refresh();
}

export async function onLoadMore() {
  const { page, per_page } = imegesApiService;

  const fetch = await imegesApiService.fetchImages();
  renderGallery(fetch.data.hits);
  lightbox.refresh();

  if (page * per_page > fetch.data.totalHits) {
    imegesApiService.finalyPage();
    observer.unobserve(refs.sentinel);
  }
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imegesApiService.query) {
      onLoadMore();
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '350px',
});

arrowTop.onclick = function () {
  window.scrollTo(pageXOffset, 0);
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = pageYOffset < document.documentElement.clientHeight;
});
