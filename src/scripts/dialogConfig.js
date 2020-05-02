import activateThebelab from './activateThebelab';

const thebelabConfig = {
  // this will speed up the process
  requestKernel: true,
};

const languageDictionary = {
  'Python 3': 'python',
  Julia: 'julia',
  R: 'r',
  Octave: 'octave',
  SageMath: 'sagemath',
  'C++': 'cpp',
};

const dataLanguageDictionary = {
  python: 'Python 3',
  julia: 'Julia',
  r: 'R',
  octave: 'Octave',
  sagemath: 'SageMath',
  'cpp': 'C++',
};

const getLanguage = (editor) => {
  const blockList = editor.document.getElementsByTag('pre');
  let language = 'Python 3';
  let i = 0;
  for (i = 0; i < blockList.count(); i += 1) {
    const codeBlock = blockList.getItem(i);
    if (codeBlock.getAttribute('data-language')) {
      language = dataLanguageDictionary[codeBlock.getAttribute('data-language')];
      break;
    }
  }
  return language;
};

const wrapPreTag = (code) => `<pre>${code}</pre>`;

const editScriptAreaHTML = (language = 'python', code = null, output = null) => {
  const sample = {
    python: {
      code: 'print(\'Hello world!\')',
      output: 'Hello world!',
    },
    r: {
      code: 'print(\'Hello world!\')',
      output: '[1] "Hello world!"',
    },
    julia: {
      code: 'println("Hello world!")',
      output: 'Hello world!',
    },
    octave: {
      code: 'printf(\'Hello world!\')',
      output: 'Hello world! Hello world!',
    },
    sagemath: {
      code: 'print(\'Hello world!\')',
      output: 'Hello world!',
    },
    cpp: {
      code: '#include <iostream>\nstd::cout << "Hello world!" << std::endl;',
      output: 'Hello world!',
    },
  };

  if (sample[language] === undefined) return 'Error!';

  return `
    <label>Edit script:</label>
    <pre data-executable="true" data-language=${language}>
      ${code === null ? sample[language].code : code}
    </pre>
    <div data-output="true">
      ${output === null ? wrapPreTag(sample[language].output) : output}
    </div>
  `;
};

const changeAllLanguages = (editor, language = 'python') => {
  // changes the data-language attribute of all pre tags
  const blockList = editor.document.getElementsByTag('pre');
  blockList.toArray().forEach((codeBlock) => {
    if (codeBlock.getAttribute('data-language')) {
      codeBlock.setAttribute('data-language', language);
    }
  });
};

const insertWarning = () => `
  <label class="warning">
    Please do not click OK until code has finished executing.
  </label>
`;

const getCodeMirror = () => {
  const cm = document.querySelector('.cke_dialog_contents .thebelab-input .CodeMirror');
  return cm ? cm.CodeMirror : null;
};

const insertFeedback = () => `
  <label class="warning">
    Have feedback? <a href="mailto:jupyterteam@ucdavis.edu">Email us</a>
    or <a href="https://github.com/LibreTexts/ckeditor-binder-plugin/issues" target="_blank">open an issue</a>
    on our issue tracker.
  </label>
`;

const dialogConfig = (editor) => ({
  title: 'Insert Interactive Script',
  minHeight: 100,
  minWidth: 400,
  onLoad() {
    const dialog = this;
    const codeArea = dialog.getContentElement('tab-basic', 'code').getElement();
    const dialogLanguage = dialog.getValueOf('tab-basic', 'language');
    codeArea.setHtml(editScriptAreaHTML(languageDictionary[dialogLanguage]));
    activateThebelab(thebelabConfig);
    window.ckeditorBinderPlugin.kernelLanguage = 'Python 3';
  },

  // The dialog is showed when either the user wants
  // to insert a new widget or edit a old widget.
  // in the case where the user wants to edit a
  // old widget, here we set the default value
  // as the state of the widget.
  // Note that when the user wants to insert a new
  // widget, the widget is already initialized although
  // it is not inserted yet.
  onShow() {
    const dialog = this;

    // set code and output
    // getModel is not supported on older versions
    // const widget = dialog.getModel(editor);
    const widget = window.ckeditorBinderPlugin.currentWidget;
    const preTag = widget.element.findOne('pre');
    let code = '';
    if (preTag) {
      code = preTag.getHtml();

      // set noCode to true
      if (preTag.hasClass('no-code')) dialog.setValueOf('tab-basic', 'radio-buttons', 'no-code');
    }

    const outputTag = widget.element.findOne('div[data-output]');
    let output = '';
    if (outputTag) {
      output = outputTag.getHtml();
    } else {
      // set noOutput to be checked
      dialog.setValueOf('tab-basic', 'radio-buttons', 'no-output');
    }

    const language = getLanguage(editor);
    dialog.setValueOf('tab-basic', 'language', language);

    const cm = getCodeMirror();
    if (cm) cm.setValue(code.trim());
    const thebelabOutputArea = document.querySelector('.cke_dialog_contents .jp-OutputArea-output');
    if (thebelabOutputArea) thebelabOutputArea.innerHTML = output;

    this.resize(500, 500);
  },
  onCancel() {
    const dialog = this;
    const editorLanguage = getLanguage(editor);
    const dialogLanguage = dialog.getValueOf('tab-basic', 'language');
    if (editorLanguage !== dialogLanguage) {
      // this will reset the thebelab instance on the dialog back to editor language
      dialog.setValueOf('tab-basic', 'language', editorLanguage);
    }
  },
  contents: [
    {
      id: 'tab-basic',
      label: 'Basic Settings',
      elements: [
        {
          type: 'select',
          id: 'language',
          label: 'Select language for page:',
          items: [['Python 3'], ['Julia'], ['R'], ['Octave'], ['SageMath'], ['C++']],
          default: 'Python 3',
          onChange() {
            if (window.ckeditorBinderPlugin.kernelLanguage !== this.getValue()) {
              const element = this.getDialog().getContentElement('tab-basic', 'code').getElement();
              element.setHtml(editScriptAreaHTML(languageDictionary[this.getValue()]));
              activateThebelab(thebelabConfig);
              window.ckeditorBinderPlugin.kernelLanguage = this.getValue();
            }
          },
        },
        {
          type: 'html',
          id: 'code',
          // html will be set in onShow()
          html: '',
        },
        {
          type: 'radio',
          id: 'radio-buttons',
          items: [['Insert with code and output', 'both'],
            ['Insert with code only', 'no-output'],
            ['Insert with output only', 'no-code']],
          default: 'both',
        },
        {
          type: 'html',
          id: 'insert-warning',
          html: insertWarning(),
        },
        {
          type: 'html',
          id: 'insert-feedback',
          html: insertFeedback(),
        },
      ],
    },
  ],

  // As a dialog of a widget, the widget
  // is inserted automaticly after this function.
  // We only need to set the correct widget data.
  onOk() {
    const dialog = this;
    // getModel is not supported on older versions
    // const widget = dialog.getModel(editor);
    const widget = window.ckeditorBinderPlugin.currentWidget;

    const language = languageDictionary[dialog.getValueOf('tab-basic', 'language')];

    // changes the data-language attributes of all pre tags in editor
    changeAllLanguages(editor, language);

    let noOutput = false;
    let noCode = false;

    switch (dialog.getValueOf('tab-basic', 'radio-buttons')) {
      case 'no-output':
        noOutput = true;
        break;
      case 'no-code':
        noCode = true;
        break;
      default:
        break;
    }

    const cm = getCodeMirror();

    let output = document.querySelector('.cke_dialog_contents .jp-OutputArea-output');

    // output might be null if no output
    if (output) {
      output = output.innerHTML;
    } else {
      output = '<pre></pre>';
    }

    // pass to widgets to figure out
    widget.setData('language', language);
    widget.setData('code', cm.getValue());
    widget.setData('noCode', noCode);
    widget.setData('output', output);
    widget.setData('noOutput', noOutput);
  },
});

export default dialogConfig;
