const API_URL = 'https://api.shrtco.de/v2/shorten?url=';

// Selecting DOM Elements
const inputURLEl = document.querySelector('.form__input-value');
const form = document.querySelector('.form');
const btnForm = document.querySelector('.form__btn');
const linkPreviewEl = document.querySelector('.link__previews');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error('The request took too long to respond.'));
    }, s * 1000);
  });
};

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
console.log('Getting in');

//  Add event handler to the Input form

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputURL = inputURLEl.value;
  console.log(inputURL);
  (async function () {
    const shortenedURL = await getJSON('inputURL');
    const previewHTML = createLinkPreview(inputURL, shortenedURL);
    linkPreviewEl.insertAdjacentHTML('afterbegin', previewHTML);
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
});
