import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { settings } from './notifixSetting';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './getPics';
import renderCard from './templates/renderCard.hbs';
import { addBackToTop } from 'vanilla-back-to-top';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const {
  elements: [input, button],
} = form;
let isFirstFetch = true;
let page = 1;

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    isFirstFetch = false;
    if (page === 13) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );

      return;
    }
    loadPics(input.value, (page += 1));
  }
}, {});
form.addEventListener('submit', onFormSubmit);
form.addEventListener('input', onFormInput);
galleryEl.addEventListener('click', onClick);

addBackToTop({
  backgroundColor: '#c72169',
  diameter: 60,
  scrollDuration: 500,
});

Notify.init(settings);

function onClick(event) {
  event.preventDefault();

  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: `alt`,
    captionDelay: 250,
  });
}

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
function getData(data) {
  if (!data.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (isFirstFetch) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  const { hits } = data;
  const markup = renderCard({ hits });
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function onFormInput(event) {
  if (!event.target.value) {
    galleryEl.innerHTML = '';
  }
  button.disabled = false;
}
function loadPics(value) {
  fetchData(value, page)
    .then(response => response.data)
    .then(data => {
      getData(data);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 0.3,
        behavior: 'smooth',
      });
      const lastCard = document.querySelector('.photo-card:last-child');
      if (lastCard) {
        infiniteObserver.observe(lastCard);
      }
    })
    .catch(error => console.log(error));
}
