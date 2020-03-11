import loadPlugin from './plugin';
import activateThebelab from './activateThebelab';
import loadScript from './ultility';

// Adds this plugin to the LibreEditor for later activation
LibreEditor.binderPlugin = (config) => {
  loadPlugin();
  config.toolbar[12].push('enableBinder');
};

while (true) {
  if ($ !== undefined && $.fn.dataTable !== undefined) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js');
    break;
  }
}

// activate thebelab on every page if data-executable exists
$(document).ready(() => { activateThebelab(); });
