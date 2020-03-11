import loadPlugin from './plugin';
import activateThebelab from './activateThebelab';
import loadScript from './ultility';

// Adds this plugin to the LibreEditor for later activation
LibreEditor.binderPlugin = (config) => {
  loadPlugin();
  config.toolbar[12].push('enableBinder');
};

// overwrite getter and setter of $.fn.dataTable because we need to load requirejs after it is set
Object.defineProperty($.fn, 'dataTable', {
  get() {
    return this.privateDataTable;
  },
  set(value) {
    // need this to avoid infinite loops
    // if we just use `this.dataTable`, it will trigger the setter again
    this.privateDataTable = value;

    // check if requirejs is already there
    if (typeof define !== 'function' || !define.amd) {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js');
    }
  },
});

// activate thebelab on every page if data-executable exists
$(document).ready(() => { activateThebelab(); });
