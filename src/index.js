import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { settings } from './notifixSetting';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPics } from './getPics';
import renderCard from './templates/renderCard.hbs';
console.log(renderCard);
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
Notify.init(settings);
Notify.failure('Я умничка, сладкая булочка!');
form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const {
    elements: [input, button],
  } = event.currentTarget;

  getPics(input.value)
    .then(response => response.data)
    .then(getData)
    .catch(error => console.log(error));
}
function getData(data) {
  if (!data.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
  const { hits } = data;
  gallery.innerHTML = renderCard({ hits });
}

// largeImageURL - ссылка на большое изображение.
