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

const observer = new IntersectionObserver(onEntry, {
  root: null,
  rootMargin: '0px 0px 350px 0px',
  threshold: 1.0,
});

function handleFormSubmit(e) {
  e.preventDefault();
  imegesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  observer.unobserve(refs.sentinel);
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

  try {
    const fetch = await imegesApiService.fetchImages();
    if (fetch.data.total === 0) {
      imegesApiService.emptyArray();
      return;
    }

    renderGallery(fetch.data.hits);
    imegesApiService.totalImagesFound(fetch.data.totalHits);
    lightbox.refresh();

    if (fetch.data.totalHits > imegesApiService.per_page) {
      setTimeout(watchForSentinel, 300);
      // observer.observe(refs.sentinel);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function onLoadMore() {
  const { page, per_page } = imegesApiService;

  try {
    const fetch = await imegesApiService.fetchImages();
    renderGallery(fetch.data.hits);
    lightbox.refresh();

    if (page * per_page > fetch.data.totalHits) {
      observer.unobserve(refs.sentinel);
      imegesApiService.finalyPage();
    }
  } catch (error) {
    console.error(error);
  }
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imegesApiService.query) {
      onLoadMore();
    }
  });
}

function watchForSentinel() {
  observer.observe(refs.sentinel);
}

arrowTop.onclick = function () {
  window.scrollTo(pageXOffset, 0);
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = pageYOffset < document.documentElement.clientHeight;
});
