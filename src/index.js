import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { settings } from './notifixSetting';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './getPics';
import renderCard from './templates/renderCard.hbs';
import { addBackToTop } from 'vanilla-back-to-top';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const {
  elements: [input, button],
} = form;
let isFirstFetch = true;
let page = 1;
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});
let totalHits = 0;

const infiniteObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    isFirstFetch = false;
    if (entry.isIntersecting) {
      console.log(galleryEl.children.length);
      if (galleryEl.children.length === totalHits) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        infiniteObserver.unobserve(entry.target);
        return;
      }
      loadPics(input.value, (page += 1));
    }
  });
}, options);
form.addEventListener('submit', onFormSubmit);
form.addEventListener('input', onFormInput);

addBackToTop({
  backgroundColor: '#c72169',
  diameter: 60,
  scrollDuration: 500,
});

Notify.init(settings);

function onFormSubmit(event) {
  event.preventDefault();

  if (input.value) {
    galleryEl.innerHTML = '';
    page = 1;
    loadPics(input.value, page);
    button.disabled = true;
  } else {
    Notify.failure('Plese, fill the search field!');
  }
}

function onFormInput(event) {
  if (!event.target.value) {
    galleryEl.innerHTML = '';
  }
  button.disabled = false;
}
async function loadPics(value) {
  try {
    const response = await fetchData(value, page);
    const { data } = response;
    totalHits = data.totalHits;
    renderGallery(data.hits, totalHits);
  } catch (error) {
    console.log(error);
  }
}
function renderGallery(hits, totalHits) {
  if (!hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (isFirstFetch) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  const markup = renderCard({ hits });
  galleryEl.insertAdjacentHTML('beforeend', markup);
  infiniteObserver.observe(guard);
  gallery.refresh();
  smoothScroll();
}
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 0.2,
    behavior: 'smooth',
  });
}
