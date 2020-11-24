import '../styles/plugin.scss';
import dialogConfig from './dialogConfig';
import widgetConfig from './widgetConfig';

const loadPlugin = () => {
  CKEDITOR.plugins.add('enableBinder', {
    onLoad: () => {
      window.ckeditorBinderPlugin = {};

      // here we can add css to the editor
      // we might consider extract it to another file
      // and use raw-loader to get it
      CKEDITOR.addCss(
        '.thebelab pre.no-code { display: none; }',
      );
    },
    init: (editor) => {
      // not sure why allowedContent in the widgetConfig
      // won't work. So set it here
      editor.filter.allow('div(thebelab-widget);pre[data-executable,data-language](no-code);div[data-output]');
      editor.filter.allow('div(thebe-status-field)');

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
