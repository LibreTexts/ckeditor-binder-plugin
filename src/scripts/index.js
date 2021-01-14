// style sheets
import '../styles/index.scss';

import './config';
import 'ckeditor4';

// this should be ran on every page
import activateThebelab from './activateThebelab';
import loadPlugin from './plugin';

loadPlugin();
CKEDITOR.replace('editor');

const output = document.getElementById('output');
const { editor } = CKEDITOR.instances;
const render = () => {
  output.innerHTML = editor.getData();
  activateThebelab();
};

// render button
document.getElementById('render-html').addEventListener('click', (e) => {
  e.preventDefault();
  render();
});
