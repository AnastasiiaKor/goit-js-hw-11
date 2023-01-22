import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { settings } from './notifixSetting';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './getPics';
import renderCard from './templates/renderCard.hbs';
import { addBackToTop } from 'vanilla-back-to-top';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyATfKW8po-lsad2VlUhO88_vy-0RZabxIk',
  authDomain: 'picsearcher-62b2a.firebaseapp.com',
  projectId: 'picsearcher-62b2a',
  storageBucket: 'picsearcher-62b2a.appspot.com',
  messagingSenderId: '481884107933',
  appId: '1:481884107933:web:d94be9b9dd51bdd5789074',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
ui.start('#firebaseui-auth-container', {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
});

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

//--------------------------------
const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const {
  elements: [input, button],
} = form;
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

const infiniteObserver = new IntersectionObserver(onObserve, options);

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
    const data = await fetchData(value, page);
    totalHits = data.totalHits;
    renderGallery(data.hits, totalHits);
    const guard = document.querySelector('.photo-card:last-child');
    infiniteObserver.observe(guard);
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
  if (page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  const markup = renderCard({ hits });
  galleryEl.insertAdjacentHTML('beforeend', markup);
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
function onObserve(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      infiniteObserver.unobserve(entry.target);
      if (galleryEl.children.length === totalHits) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      loadPics(input.value, (page += 1));
    }
  });
}
