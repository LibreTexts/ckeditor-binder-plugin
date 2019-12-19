// style sheets
import '../styles/index.scss';

import './config';
import 'ckeditor4';
import './plugin';

CKEDITOR.config.extraPlugins = 'enableBinder';
CKEDITOR.replace('editor');
