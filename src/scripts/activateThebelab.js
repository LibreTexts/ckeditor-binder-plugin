const loadThebelabScript = () => new Promise((resolve, reject) => {
  if (window.thebelab !== undefined) resolve();

  const script = document.createElement('script');

  script.onload = () => { resolve(); };
  script.onerror = () => { reject(); };

  script.src = 'https://unpkg.com/thebelab@0.5.1/lib/index.js';
  document.head.appendChild(script);
});

const binderUrl = 'https://mybinder.org';

const defaultConfig = {
  binderOptions: {
    repo: 'binder-examples/requirements',
    binderUrl,
  },
};

const getLanguage = () => {
  const element = document.querySelector('[data-executable=true]');
  let language = 'python3';

  if (element !== null) {
    const dataLanguage = element.getAttribute('data-language');
    if (dataLanguage && dataLanguage !== '') language = dataLanguage;
  }

  return language;
};

const getConfig = (language) => {
  const config = {
    binderOptions: {
      repo: 'LibreTexts/ckeditor-binder-plugin',
      ref: 'test_mplWid'
      binderUrl,
    },
    kernelOptions: {
      kernelName: 'python3',
    },
  };

  switch (language) {
    case 'SageMath':
      config.binderOptions.repo = 'sagemath/sage-binder-env';
      config.kernelOptions.kernelName = 'sagemath';
      break;
    case 'julia':
      config.binderOptions.repo = 'binder-examples/demo-julia';
      config.kernelOptions.kernelName = 'julia-1.1';
      break;
    case 'octave':
      config.binderOptions.repo = 'binder-examples/octave';
      config.kernelOptions.kernelName = 'octave';
      break;
    case 'R':
      config.binderOptions.repo = 'binder-examples/r';
      config.kernelOptions.kernelName = 'ir';
      break;
    case 'python3':
    default:
  }

  return config;
};

const activateThebelab = (config, detectLanguage = true) => {
  let mergeConfig = config;
  if (!mergeConfig) mergeConfig = defaultConfig;

  // check if any pre block with data-executable=true
  if (document.querySelector('[data-executable=true]') !== null) {
    if (detectLanguage) {
      mergeConfig = Object.assign(mergeConfig, getConfig(getLanguage()));
    }

    loadThebelabScript()
      .then(() => {
        thebelab.bootstrap(mergeConfig);
      })
      .catch(() => {
        // todo: deal with error handling
      });
  }
};

export default activateThebelab;
