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
      repo: 'matplotlib/jupyter-matplotlib',
      binderUrl,
    },
    kernelOptions: {
      kernelName: 'python',
    },
  };

  switch (language) {
    case 'sagemath':
      config.binderOptions.repo = 'sagemath/sage-binder-env';
      config.binderOptions.ref = 'master';
      config.kernelOptions.kernelName = 'sagemath';
      break;
    case 'julia':
      config.binderOptions.repo = 'binder-examples/demo-julia';
      config.binderOptions.ref = 'master';
      config.kernelOptions.kernelName = 'julia-1.1';
      break;
    case 'octave':
      config.binderOptions.repo = 'binder-examples/octave';
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
