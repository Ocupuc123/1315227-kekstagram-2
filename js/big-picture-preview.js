import { photos } from './data.js';
import { isEscapeKey } from './util.js';

const pictures = document.querySelector('.pictures');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const bigPictureCaption = bigPicture.querySelector('.social__caption');
const bigPictureLikes = bigPicture.querySelector('.likes-count');
const bigPictureComments = bigPicture.querySelector('.social__comments');
const bigPictureCommentsLoader = bigPicture.querySelector('.social__comments-loader');
const bigPictureCommentsCount = bigPicture.querySelector('.social__comment-count');
const bigPictureCommentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const bigPictureCommentTotalCount = bigPicture.querySelector('.social__comment-total-count');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');

const createComment = ({avatar, message, name}) => `<li class="social__comment">
  <img
    class="social__picture"
    src="${avatar}"
    alt="${name}"
    width="35" height="35">
  <p class="social__text">${message}</p>
</li>`;

const onBigPictureCloseClick = () => {
  closePicturePreview();
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePicturePreview();
  }
};

function closePicturePreview() {
  document.body.classList.remove('modal-open');
  bigPicture.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
  bigPictureCloseButton.removeEventListener('click', onBigPictureCloseClick);
}

const openPicturePreview = (currentId) => {
  const currentPhoto = photos.find((photo) => photo.id === Number(currentId));

  if (!currentPhoto) {
    return;
  }

  document.body.classList.add('modal-open');
  bigPictureCommentsCount.classList.add('hidden');
  bigPictureCommentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  bigPictureComments.innerHTML = '';

  bigPictureImage.src = currentPhoto?.url;
  bigPictureCaption.textContent = currentPhoto?.description;
  bigPictureLikes.textContent = currentPhoto?.likes;
  bigPictureCommentTotalCount.textContent = currentPhoto?.comments.length;

  currentPhoto?.comments.forEach((comment) => {
    bigPictureComments.insertAdjacentHTML('beforeend', createComment(comment));
  });

  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureCloseButton.addEventListener('click', onBigPictureCloseClick);
};

let isBigPictureInitialized = false;

const initBigPicturePreview = () => {
  if (isBigPictureInitialized) {
    return;
  }

  pictures.addEventListener('click', (evt) => {
    const targetPicture = evt.target.closest('.picture');

    if (targetPicture) {
      evt.preventDefault();
      const id = targetPicture.dataset.pictureId;
      openPicturePreview(id);
    }
  });

  isBigPictureInitialized = true;
};

export { initBigPicturePreview };
