import { isEscapeKey } from './util.js';

const uploadImage = document.querySelector('.img-upload');
const uploadImageFileInput = uploadImage.querySelector('#upload-file');
const uploadImageForm = uploadImage.querySelector('#upload-select-image');
const uploadImageOverlay = uploadImage.querySelector('.img-upload__overlay');
const uploadImageClose = uploadImage.querySelector('#upload-cancel');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadImage();
  }
};

const onUploadImageCloseClick = () => {
  closeUploadImage();
};

const clearUploadImage = () => {
  uploadImageFileInput.value = '';
  uploadImageForm.reset();
};

const openUploadImage = () => {
  document.body.classList.add('modal-open');
  uploadImageOverlay.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
};

const initUploadImage = () => {
  uploadImageFileInput.addEventListener('change', () => {
    openUploadImage();
  });

  uploadImageClose.addEventListener('click', onUploadImageCloseClick);
};

function closeUploadImage() {
  clearUploadImage();
  document.body.classList.remove('modal-open');
  uploadImageOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
}

export { initUploadImage };
