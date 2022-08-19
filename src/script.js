const API_URL = 'https://api.shrtco.de/v2/shorten?url=';

// Selecting DOM Elements
const inputURLEl = document.querySelector('.form__input-value');
const form = document.querySelector('.form');
const btnForm = document.querySelector('.form__btn');
const linkPreviewEl = document.querySelector('.link__previews');
const emptyErrorMsg = document.querySelector('.empty-msg');

// Defining the URL Array
emptyErrorMsg.style.display = 'none';
const URLs = [];
const createLinkPreview = function (inputURL, shortenedURL) {
  return `<div class="link__preview">
          <p class="link__input">
            ${inputURLEl}
          </p>
           <p class="link__short">
           ${shortenedURL}
          </p>
          <button class="link__btn btn">Copy</button>
        </div>`;
};

// Checking if there is any Url saved before
(function () {
  const URLs = JSON.parse(localStorage.getItem('URLs'));
  if (!URLs) return;
  URLs.forEach(URL => {
    const previewHTML = createLinkPreview(URL.inputURL, URL.shortenedURL);
    linkPreviewEl.insertAdjacentHTML('afterbegin', previewHTML);
  });
})();

const saveURLs = function (inputURL, shortenedURL) {
  URLs.push({ inputURL, shortenedURL });
  localStorage.setItem('URLs', JSON.stringify(URLs));
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error('The request took too long to respond.'));
    }, s * 1000);
  });
};

const getJSON = async function (inputURL) {
  try {
    // const res = await fetch(`${API_URL}${inputURL}`);
    const fetchData = fetch(`${API_URL}${inputURL}`);
    const res = await Promise.race([fetchData, timeout(20)]);
    console.log(res);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

getJSON('https://github.com/Wongel-Yilma/Url-shortening-API');

//  Add event handler to the Input form

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputURL = inputURLEl.value;
  console.log(inputURL);
  if (!inputURL) {
    emptyErrorMsg.style.display = 'block';
    return;
  }
  emptyErrorMsg.style.display = 'none';
  (async function () {
    const shortenedURL = await getJSON('inputURL');
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
