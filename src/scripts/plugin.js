import '../styles/plugin.scss';
import dialogConfig from './dialog';
import widgetConfig from './widget';

const loadPlugin = () => {
  CKEDITOR.plugins.add('enableBinder', {
    init: (editor) => {
      // not sure why allowedContent in the widgetConfig
      // won't work. So set it here
      editor.filter.allow('div(thebelab);pre[data-executable,data-language];div[data-output]');

      CKEDITOR.dialog.add('binderDialog', dialogConfig);
      editor.widgets.add('thebelabWidget', widgetConfig);

      // add button to toolbar
      editor.ui.addButton('enableBinder', {
        label: 'Enable Binder',
        command: 'thebelabWidget',
        toolbar: 'insert',
        icon: 'https://binderhub.readthedocs.io/en/latest/_static/favicon.png',
      });
    },
  });

  if (CKEDITOR.config.extraPlugins === '') {
    CKEDITOR.config.extraPlugins += 'enableBinder';
  } else {
    CKEDITOR.config.extraPlugins += ',enableBinder';
  }
};

export default loadPlugin;
