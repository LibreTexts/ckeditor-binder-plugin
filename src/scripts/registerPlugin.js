import loadPlugin from './plugin';
import activateThebelab from './activateThebelab';
import loadScript from './loadScript';

// load required scripts first
// both is required for jupyter widgets
loadScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js')
  .then(() => {
    // this line prevents future jquery plugins to be loaded within requirejs
    if (window.define !== undefined) window.define.amd = null;
  });

if (document.currentScript.dataset.loadfa !== "false") { //loads font-awesome scripts unless otherwise disabled
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js')
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/v4-shims.min.js')
}

// Adds this plugin to the LibreEditor for later activation
LibreEditor.binderPlugin = (config) => {
  loadPlugin();
  config.toolbar[12].push('enableBinder');
};

// activate thebelab on every page if data-executable exists
$(document).ready(() => { activateThebelab(); });
