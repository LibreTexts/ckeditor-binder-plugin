import loadScript from './loadScript';

const binderUrl = 'https://binder.libretexts.org/';

// print CKEditor Binder Plugin version info
const versionInfo = 'CKEditor Binder Plugin Development Version';
console.log(versionInfo);

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
      ref: '3.1.0',
      binderUrl,
    },
    kernelOptions: {
      name: 'python',
    },
  };

  switch (language) {
    case 'text/x-c++src':
      config.kernelOptions.name = 'xcpp14';
      break;
    case 'sagemath':
      config.kernelOptions.name = 'sagemath';
      break;
    case 'julia':
      config.kernelOptions.name = 'julia-1.6';
      break;
    case 'octave':
      config.kernelOptions.name = 'octave';
      break;
    case 'r':
      config.kernelOptions.name = 'ir';
      break;
    case 'python':
    default:
  }

  return config;
};

const insertThebeStatusHTML = (language) => {
  const body = document.getElementsByTagName('body')[0];
  const statusField = document.createElement('div');
  statusField.innerHTML = `${language.toUpperCase()} Session: NOT STARTED`;
  statusField.setAttribute('class', 'thebe-status-field');
  body.append(statusField);
};

const registerThebeStatusEvent = (language) => {
  thebelab.on('status', (e, data) => {
    const statusElement = document.getElementsByClassName('thebe-status-field')[0];
    if (statusElement !== undefined) {
      statusElement.innerHTML = `${language.toUpperCase()} Session: ${data.status.toUpperCase()}`;
      statusElement.setAttribute('class', `thebe-status-field thebe-status-${data.status}`);

      if (data.status === 'ready') {
        setTimeout(() => {
          statusElement.remove();
        }, 3000);
      }
    }
  });
};

const removeStatusHtmlIfAny = () => {
  const statusField = document.querySelector('.thebe-status-field');
  if (statusField !== null) {
    statusField.remove();
  }
};

const activateThebelab = (config, detectLanguage = true) => {
  let mergeConfig = config;
  if (!mergeConfig) mergeConfig = defaultConfig;

  // check if any pre block with data-executable=true
  if (document.querySelector('[data-executable=true]') !== null) {
    const language = getLanguage();
    if (detectLanguage) {
      mergeConfig = Object.assign(mergeConfig, getConfig(language));
    }

    loadScript('https://unpkg.com/thebe@0.8.0/lib/index.js')
      .then(() => {
        thebelab.bootstrap(mergeConfig);
        if (detectLanguage) {
          removeStatusHtmlIfAny();
          insertThebeStatusHTML(language);
          registerThebeStatusEvent(language);
        }
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
