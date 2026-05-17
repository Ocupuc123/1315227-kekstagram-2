const ALERT_SHOW_TIME = 5000;
const DEFAULT_DELAY = 500;

const errorFragment = document.querySelector('#data-error').content;
const errorTemplate = errorFragment.querySelector('.data-error');
const body = document.body;

const showErrorAlert = (message) => {
  const alert = errorTemplate.cloneNode(true);
  const title = alert.querySelector('.data-error__title');

  title.textContent = message;
  body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, ALERT_SHOW_TIME);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

function debounce(callback, timeoutDelay = DEFAULT_DELAY) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

export { isEscapeKey, showErrorAlert, debounce };
