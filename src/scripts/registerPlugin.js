import loadPlugin from './plugin';
import activateThebelab from './activateThebelab';

// Adds this plugin to the LibreEditor for later activation
LibreEditor.binderPlugin = (config) => {
  loadPlugin();
  config.toolbar[12].push('enableBinder');
};

// activate thebelab on every page if data-executable exists
$(document).ready(() => { activateThebelab(); });
