const refs = {
  gallery: document.querySelector('.gallery'),
};

export function renderGallery(data) {
  const gallery = data
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
        return `
          <div class="card-thumb">
            <a class="card" href="${largeImageURL}" rel="noreferrer noopener">
              <img class="card__image" src="${webformatURL}" alt="${tags}"
              data-source="${largeImageURL}" loading="lazy width="720" height="480"" />
              <div class="card__overlay">
                <div class="card__header">
                  <div class="card__text">
                    <p class="info-item"><b>Likes:</b> ${likes}</p>
                    <p class="info-item"><b>Views:</b> ${views}</p>
                  </div>
                  <div class="card__text">
                    <p class="info-item"><b>Comments:</b> ${comments}</p>
                    <p class="info-item"><b>Downloads:</b> ${downloads}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        `;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', gallery);
}

export function clearThePage() {
  refs.gallery.innerHTML = '';
}

export function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}