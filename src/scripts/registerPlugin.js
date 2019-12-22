import loadPlugin from './plugin.js';
import activateThebelab from './activateThebelab';

// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName('head')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: false };

// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
  for(let i = 0; i < mutationsList.length; i++) {
    const mutation = mutationsList[i];

    if (mutation.addedNodes.length === 0) continue;
    const node = mutation.addedNodes[0];

    // listen for the editor.js script to be added
    if (node.tagName === 'SCRIPT' && node.src.includes('editor.js')) {
      // load plugin when the editor script is loaded
      node.addEventListener('load', loadPlugin);
      observer.disconnect();
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// activate thebelab on every page if data-executable exists
$(document).ready(() => { activateThebelab() });
