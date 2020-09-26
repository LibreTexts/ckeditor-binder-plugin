import loadScript from './loadScript';

const binderUrl = 'https://binder.libretexts.org';

const defaultConfig = {
  binderOptions: {
    repo: 'binder-examples/requirements',
    binderUrl,
  },
};

const getLanguage = () => {
  const element = document.querySelector('[data-executable=true]');
  let language = 'python';

  if (element !== null) {
    const dataLanguage = element.getAttribute('data-language');
    if (dataLanguage && dataLanguage !== '') language = dataLanguage;
  }

  return language;
};

const getConfig = (language) => {
  const config = {
    binderOptions: {
      repo: 'LibreTexts/default-env',
      ref: '2.0.1',
      binderUrl,
    },
    kernelOptions: {
      kernelName: 'python',
    },
  };

  switch (language) {
    case 'text/x-c++src':
      config.kernelOptions.kernelName = 'xcpp14';
      break;
    case 'sagemath':
      config.kernelOptions.kernelName = 'sagemath';
      break;
    case 'julia':
      config.kernelOptions.kernelName = 'julia-1.5';
      break;
    case 'octave':
      config.kernelOptions.kernelName = 'octave';
      break;
    case 'r':
      config.kernelOptions.kernelName = 'ir';
      break;
    case 'python':
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

    loadScript('https://unpkg.com/thebelab@0.5.1/lib/index.js')
      .then(() => {
        thebelab.bootstrap(mergeConfig);
      })
      .catch(() => {
        // todo: deal with error handling
      });
  }

  // edge warning
  if (navigator.userAgent.includes('Edge')) {
    // disable eslint warning, this is meant to be obtrusive
    alert("WARNING: You're using an older version of Edge. All code cells on this page will be broken on your browser. Please update to Chromium Edge or use a different browser."); // eslint-disable-line no-alert
  }
};

export default activateThebelab;
