// style sheets
import '../styles/index.scss';

import './config';
import 'ckeditor4';

// this should be ran on every page
import activateThebelab from './activateThebelab';
import loadPlugin from './plugin';

loadPlugin();
CKEDITOR.replace('editor');

const thebelabConfig = {
  binderOptions: {
    repo: 'binder-examples/requirements',
    binderUrl: 'https://mybinder.org',
  },
  kernelOptions: {
    name: 'python3',
  },
};

const output = document.getElementById('output');
const { editor } = CKEDITOR.instances;
const render = () => {
  output.innerHTML = editor.getData();
  activateThebelab(thebelabConfig);
};

// render button
document.getElementById('render-html').addEventListener('click', (e) => {
  e.preventDefault();
  render();
});
