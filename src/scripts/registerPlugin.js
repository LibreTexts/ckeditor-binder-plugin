import loadPlugin from './plugin.js';
import activateThebelab from './activateThebelab';

//Adds this plugin to the LibreEditor for later activation
LibreEditor.binderPlugin = loadPlugin;

// activate thebelab on every page if data-executable exists
$(document).ready(() => { activateThebelab() });
