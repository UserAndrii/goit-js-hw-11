import onLoadMore from '../index'

const refs = {
  loadMore: document.querySelector('.load-more'),
};

refs.loadMore.addEventListener('click', onLoadMore);