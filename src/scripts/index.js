// style sheets
import '../styles/index.scss';

import './config';
import 'ckeditor4';
import './plugin';
import activateThebelab from './activateThebelab';

CKEDITOR.config.extraPlugins = 'enableBinder';
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
document.getElementById('render-html').addEventListener('click', (e) => {
  e.preventDefault();
  const data = CKEDITOR.instances.editor.getData();
  output.innerHTML = data;

  activateThebelab(thebelabConfig);
});
