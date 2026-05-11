import { isEscapeKey } from './util.js';
import { validateFormReset } from './validate-form.js';

const ScaleDirection = {
  DECREASE: -1,
  INCREASE: 1
};

const ScaleStep = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
  DEFAULT: 100
};

const effectConfig = {
  chrome: {
    property: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    property: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    property: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    property: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    property: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  },
};

const body = document.body;
const uploadImage = document.querySelector('.img-upload');
const uploadImageFileInput = uploadImage.querySelector('#upload-file');
const uploadImageForm = uploadImage.querySelector('#upload-select-image');
const uploadImageOverlay = uploadImage.querySelector('.img-upload__overlay');
const uploadImageClose = uploadImage.querySelector('#upload-cancel');
const uploadImagePreview = uploadImage.querySelector('.img-upload__preview img');
const uploadImageEffectLevel = uploadImage.querySelector('.img-upload__effect-level');
const uploadImageEffects = uploadImage.querySelector('.img-upload__effects');
const uploadImageEffectValue = uploadImage.querySelector('[name="effect-level"]');
const uploadImageEffectSlider = uploadImage.querySelector('.effect-level__slider');
const scaleControlSmaller = uploadImage.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadImage.querySelector('.scale__control--bigger');
const scaleControlInput = uploadImage.querySelector('[name="scale"]');

let slider = null;
let currentEffect = 'none';
let currentScale = parseFloat(scaleControlInput.value);

const applyFilterEffect = (effect, value) => `${effectConfig[effect]?.property}(${parseFloat(value)}${effectConfig[effect]?.unit})`;
const applyTransformScale = (value) => `scale(${parseFloat(value) / 100})`;

const onSliderUpdate = () => {
  if (currentEffect === 'none') {
    return;
  }
  const value = parseFloat(slider.get());
  uploadImagePreview.style.filter = applyFilterEffect(currentEffect, value);
  uploadImageEffectValue.value = value;
};

const initEffectSlider = () => {
  const options = {
    connect: [true, false],
    start: [effectConfig[currentEffect].max],
    step: effectConfig[currentEffect].step,
    range: {
      'min': effectConfig[currentEffect].min,
      'max': effectConfig[currentEffect].max
    }
  };

  if (!slider) {
    slider = noUiSlider.create(uploadImageEffectSlider, options);
    slider.on('update', onSliderUpdate);
  } else {
    slider.updateOptions(options);
    slider.set(effectConfig[currentEffect].max);
  }
};

const checkEffectSliderVisibility = (effect) => {
  currentEffect = effect;

  if (effect === 'none') {
    uploadImageEffectLevel.classList.add('hidden');
    uploadImagePreview.style.filter = '';
    uploadImageEffectValue.value = '';
  } else {
    uploadImageEffectLevel.classList.remove('hidden');
    initEffectSlider();
  }
};

const onScaleControlClick = (direction) => {
  currentScale = Math.min(Math.max(currentScale + (direction * ScaleStep.STEP), ScaleStep.MIN), ScaleStep.MAX);

  scaleControlInput.value = `${currentScale}%`;
  uploadImagePreview.style.transform = applyTransformScale(currentScale);
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadImage();
  }
};

const onUploadImageCloseClick = () => {
  closeUploadImage();
};

const clearUploadImageForm = () => {
  uploadImageFileInput.value = '';
  uploadImagePreview.style = '';
  uploadImageForm.reset();
  currentEffect = 'none';
  currentScale = ScaleStep.DEFAULT;

  if (slider) {
    slider.destroy();
    slider = null;
  }
};

const openUploadImage = () => {
  body.classList.add('modal-open');
  uploadImageOverlay.classList.remove('hidden');
  checkEffectSliderVisibility('none');

  document.addEventListener('keydown', onDocumentKeydown);
};

const initUploadImage = () => {
  uploadImageFileInput.addEventListener('change', openUploadImage);
  scaleControlSmaller.addEventListener('click', () => {
    onScaleControlClick(ScaleDirection.DECREASE);
  });
  scaleControlBigger.addEventListener('click', () => {
    onScaleControlClick(ScaleDirection.INCREASE);
  });
  uploadImageClose.addEventListener('click', onUploadImageCloseClick);

  uploadImageEffects.addEventListener('change', () => {
    checkEffectSliderVisibility(uploadImageForm['effect'].value);
  });
};

function closeUploadImage() {
  clearUploadImageForm();
  validateFormReset();
  body.classList.remove('modal-open');
  uploadImageOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
}

export { initUploadImage };
