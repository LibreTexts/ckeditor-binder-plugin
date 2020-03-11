const loadScript = (url) => new Promise((resolve, reject) => {
  const script = document.createElement('script');

  script.onload = () => { resolve(); };
  script.onerror = () => { reject(); };

  script.src = url;
  document.head.appendChild(script);
});

export default loadScript;
