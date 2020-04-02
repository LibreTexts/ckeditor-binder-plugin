const loadScript = (url) => new Promise((resolve, reject) => {
  if (window.thebelab !== undefined) resolve();

  const script = document.createElement('script');

  script.onload = () => { resolve(); };
  script.onerror = () => { reject(); };

  script.src = url;
  document.head.appendChild(script);
});

export default loadScript;
