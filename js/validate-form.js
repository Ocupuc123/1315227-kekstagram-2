import { isEscapeKey } from './util.js';

const COMMENTS_MAX_CHARACTERS = 140;
const HASHTAGS_MAX_LENGTH = 5;
const HASHTAGS_MAX_CHARACTERS = 20;

const ErrorMessage = {
  MAX_CHARACTERS_FOR_HASHTAGS: `максимальная длина одного хэштега ${HASHTAGS_MAX_CHARACTERS} символов`,
  INVALID_LEADING_HASH: 'хэштег должен начинаться с символа #',
  INVALID_PATTERN_FOR_HASHTAGS: 'введён невалидный хэштег',
  EXCEEDED_NUMBER_FOR_HASHTAGS: 'превышено количество хэштегов',
  REPEATED_FOR_HASHTAGS: 'хэштеги повторяются',
  ONLY_HASH_SYMBOL: 'хэштег не может состоять только из символа #',
  MAX_LENGTH_FOR_COMMENTS: `длина комментария больше ${COMMENTS_MAX_CHARACTERS} символов`
};

const uploadImageForm = document.querySelector('#upload-select-image');
const hashtagsField = uploadImageForm.querySelector('[name="hashtags"]');
const commentsField = uploadImageForm.querySelector('[name="description"]');

const pristine = new Pristine(uploadImageForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
}, true);

let lastErrorMessage = '';

const getHashtagsArray = (value) => value.trim().split(/\s+/).filter(Boolean);
const isUniqueHashtags = (array) => array.every((item, index) => array.indexOf(item) === index);

const validateComments = (value) => value.length <= COMMENTS_MAX_CHARACTERS;

const validateHashtags = (value) => {

  if (value.trim() === '') {
    return true;
  }

  const hashtags = getHashtagsArray(value);
  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  if (hashtags.length > HASHTAGS_MAX_LENGTH) {
    lastErrorMessage = ErrorMessage.EXCEEDED_NUMBER_FOR_HASHTAGS;
    return false;
  }

  if (!isUniqueHashtags(lowerCaseHashtags)) {
    lastErrorMessage = ErrorMessage.REPEATED_FOR_HASHTAGS;
    return false;
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      lastErrorMessage = ErrorMessage.INVALID_LEADING_HASH;
      return false;
    }

    if (hashtag === '#') {
      lastErrorMessage = ErrorMessage.ONLY_HASH_SYMBOL;
      return false;
    }

    if (hashtag.length > HASHTAGS_MAX_CHARACTERS) {
      lastErrorMessage = ErrorMessage.MAX_CHARACTERS_FOR_HASHTAGS;
      return false;
    }

    const regexp = /^#[a-zа-яё0-9]+$/i;

    if (!regexp.test(hashtag)) {
      lastErrorMessage = ErrorMessage.INVALID_PATTERN_FOR_HASHTAGS;
      return false;
    }
  }

  return true;
};

const getHashtagsErrorMessage = () => lastErrorMessage;

const onEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const validateForm = () => {
  hashtagsField.addEventListener('keydown', onEscapeKeydown);
  commentsField.addEventListener('keydown', onEscapeKeydown);

  pristine.addValidator(hashtagsField, validateHashtags, getHashtagsErrorMessage);
  pristine.addValidator(commentsField, validateComments, ErrorMessage.MAX_LENGTH_FOR_COMMENTS);

  uploadImageForm.addEventListener('submit', (evt) => {
    const isValid = pristine.validate();

    if (!isValid) {
      evt.preventDefault();
    }
  });
};

const validateFormReset = () => pristine.reset();

export { validateForm, validateFormReset };
