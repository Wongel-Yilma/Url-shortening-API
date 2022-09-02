const API_URL = 'https://api.shrtco.de/v2/shorten?url=';

// Selecting DOM Elements
const inputURLEl = document.querySelector('.form__input-value');
const form = document.querySelector('.form');
const btnForm = document.querySelector('.form__btn');
const linkPreviewEl = document.querySelector('.link__previews');
const emptyErrorMsg = document.querySelector('.empty-msg');
const btnMobileNav = document.querySelector('.btn-mobile-nav');
const headerEl = document.querySelector('.header');
emptyErrorMsg.style.display = 'none';

// Defining the URL Array
const URLs = [];
// Rendering the Link Preview List Item
const createLinkPreview = function (inputURL, shortenedURL) {
  const shortened = `https://${shortenedURL}`;
  return `<div class="link__preview">
          <p class="link__input">
            ${inputURL}
          </p>
           <p class="link__short">
           <a>${shortened}</a>
          </p>
          <button class="link__btn btn">Copy</button>
        </div>`;
};

// Checking if there is any Url saved before on start up and rendering them
(function () {
  const URLs = JSON.parse(localStorage.getItem('URLs'));
  if (!URLs) return;
  URLs.forEach(URL => {
    const previewHTML = createLinkPreview(URL.inputURL, URL.shortenedURL);
    linkPreviewEl.insertAdjacentHTML('afterbegin', previewHTML);
  });
})();

// To upload the data on localstorage
const saveURLs = function (inputURL, shortenedURL) {
  URLs.push({ inputURL, shortenedURL });
  localStorage.setItem('URLs', JSON.stringify(URLs));
};

// Creating timeout Promise
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error('The request took too long to respond.'));
    }, s * 1000);
  });
};

const getJSON = async function (inputURL) {
  try {
    const fetchData = fetch(`${API_URL}${inputURL}`);
    const res = await Promise.race([fetchData, timeout(5)]);
    console.log(res);
    // if (res.ok === false) throw new Error('Invalid URL ');
    const data = await res.json();
    return data.result.short_link;
  } catch (err) {
    console.error(err);
  }
};

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputURL = inputURLEl.value;
  if (!inputURL) {
    emptyErrorMsg.style.display = 'block';
    return;
  }
  emptyErrorMsg.style.display = 'none';
  (async function () {
    const shortenedURL = await getJSON(inputURL);
    if (!shortenedURL) return;
    const previewHTML = createLinkPreview(inputURL, shortenedURL);
    linkPreviewEl.insertAdjacentHTML('afterbegin', previewHTML);
    saveURLs(inputURL, shortenedURL);
  })();
});

linkPreviewEl.addEventListener('click', function (e) {
  if (!e.target.closest('.btn')) return;
  const clickedBtn = e.target.closest('.btn');
  clickedBtn.innerHTML = 'Copied';
  clickedBtn.style.backgroundColor = 'hsl(257, 27%, 26%)';
  const copyText = clickedBtn
    .closest('.link__preview')
    .querySelector('.link__short').textContent;
  navigator.clipboard.writeText(copyText);
  // JSON.stringify('copiedURL')
});

// Toggle the mobile navigation sidebar
btnMobileNav.addEventListener('click', function (e) {
  headerEl.classList.toggle('nav-open');
});
