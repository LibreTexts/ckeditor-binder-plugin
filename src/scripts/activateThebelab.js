import loadScript from './loadScript';

const binderUrl = 'https://mybinder.org';

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
      repo: 'LibreTexts/ckeditor-binder-plugin',
      ref: 'Python-Env',
      binderUrl,
    },
    kernelOptions: {
      kernelName: 'python',
    },
  };

  switch (language) {
    case 'text/x-c++src':
      config.binderOptions.repo = 'jupyter-xeus/xeus-cling';
      config.binderOptions.ref = 'stable';
      config.kernelOptions.kernelName = 'xcpp14';
      break;
    case 'sagemath':
      config.binderOptions.repo = 'sagemath/sage-binder-env';
      config.binderOptions.ref = 'master';
      config.kernelOptions.kernelName = 'sagemath';
      break;
    case 'julia':
      config.binderOptions.repo = 'binder-examples/demo-julia';
      config.binderOptions.ref = 'master';
      config.kernelOptions.kernelName = 'julia-1.4';
      break;
    case 'octave':
      config.binderOptions.repo = 'LibreTexts/jupyter-octave';
      config.binderOptions.ref = 'master';
      config.kernelOptions.kernelName = 'octave';
      break;
    case 'r':
      config.binderOptions.repo = 'binder-examples/r';
      config.binderOptions.ref = 'master';
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
    alert("WARNING: You're using an older version of Edge. All code cells on this page will be broken on your browser. Please update to Chromium Edge or use a different browser.");
  }
};

export default activateThebelab;
