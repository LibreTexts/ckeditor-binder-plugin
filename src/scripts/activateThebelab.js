const loadThebelabScript = () => new Promise((resolve, reject) => {
  if (window.thebelab !== undefined) return;

  const script = document.createElement('script');

  script.onload = () => { resolve(); };
  script.onerror = () => { reject(); };

  script.src = 'https://unpkg.com/thebelab@0.5.1/lib/index.js';
  document.head.appendChild(script);
});

const activateThebelab = (config) => {
  // check if any pre block with data-executable=true
  if (document.querySelector('[data-executable=true]') !== null) {
    loadThebelabScript()
      .then(() => {
        thebelab.bootstrap(config);
      })
      .catch(() => {
        // todo: deal with error handling
      });
  }
};

export default activateThebelab;
