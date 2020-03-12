import activateThebelab from './activateThebelab';

const thebelabConfig = {
  // this will speed up the process
  requestKernel: true,
};

const languageDictionary = {
  'Python 3': ['python'],
  Julia: ['julia'],
  R: ['r'],
  Octave: ['octave'],
  SageMath: ['sagemath'],
};

const dataLanguageDictionary = {
  python: ['Python 3'],
  julia: ['Julia'],
  r: ['R'],
  octave: ['Octave'],
  sagemath: ['SageMath'],
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
  };

  if (sample[language] === undefined) return 'Error!';

  return `
    <label>Edit script:</label>
    <pre data-executable="true" data-language=${language}>
      ${code === null ? sample[language].code : code}
    </pre>
    <div data-output="true">
      ${output === null ? sample[language].output : output}
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

const dialogConfig = (editor) => ({
  title: 'Insert Interactive Script',
  minHeight: 100,
  minWidth: 400,

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
    const language = getLanguage(editor);

    // set code and output
    // getModel is not supported on older versions
    // const widget = dialog.getModel(editor);
    const widget = window.currentEditedThebelabWidgetByBinderDialog;
    const preTag = widget.element.findOne('pre');
    let code = '';
    if (preTag) {
      code = preTag.getHtml();

      // set noCode to true
      if (preTag.hasClass('no-code')) dialog.setValueOf('tab-basic', 'no-code', true);
    }

    const outputTag = widget.element.findOne('div[data-output]');
    let output = '';
    if (outputTag) {
      output = outputTag.getHtml();
    } else {
      // set noOutput to be checked
      dialog.setValueOf('tab-basic', 'no-output', true);
    }

    const codeArea = dialog.getContentElement('tab-basic', 'code').getElement();
    codeArea.setHtml(editScriptAreaHTML(languageDictionary[language], code, output));

    this.resize(500, 500);

    dialog.setValueOf('tab-basic', 'language', language);
  },
  onCancel() {
    const dialog = this;
    const editorLanguage = getLanguage(editor);
    const dialogLanguage = dialog.getValueOf('tab-basic', 'language');
    if (editorLanguage !== dialogLanguage) {
      activateThebelab(thebelabConfig);
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
          items: [['Python 3'], ['Julia'], ['R'], ['Octave'], ['SageMath']],
          default: 'Python 3',
          onChange() {
            const element = this.getDialog().getContentElement('tab-basic', 'code').getElement();
            element.setHtml(editScriptAreaHTML(languageDictionary[this.getValue()]));
            activateThebelab(thebelabConfig);
          },
        },
        {
          type: 'html',
          id: 'code',
          // html will be set in onShow()
          html: '',
        },
        {
          type: 'hbox',
          id: 'checkboxes',
          widths: ['25%', '25%', '50%'],
          children: [
            {
              type: 'checkbox',
              id: 'no-output',
              label: 'Insert without output',
            },
            {
              type: 'checkbox',
              id: 'no-code',
              label: 'Insert with code hidden',
            },
            {
              type: 'html',
              html: '',
            },
          ],
        },
        {
          type: 'html',
          id: 'insert-warning',
          html: insertWarning(),
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
    const widget = window.currentEditedThebelabWidgetByBinderDialog;

    const language = languageDictionary[dialog.getValueOf('tab-basic', 'language')];

    // changes the data-language attributes of all pre tags in editor
    changeAllLanguages(editor, language);

    const noOutput = dialog.getValueOf('tab-basic', 'no-output');
    const noCode = dialog.getValueOf('tab-basic', 'no-code');
    const cm = document.querySelector('.cke_dialog_contents .thebelab-input .CodeMirror').CodeMirror;

    let output = document.querySelector('.cke_dialog_contents .jp-OutputArea-output');
    // the output will contain a pre tag if run by binder
    if (output.children.length !== 0 && output.children[0].tagName === 'PRE') {
      output = output.children[0].innerHTML;
    } else {
      output = output.innerHTML;
    }

    // pass to widgets to figure out
    widget.setData('language', language);
    widget.setData('code', cm.getValue());
    widget.setData('noCode', noCode);
    widget.setData('output', output);
    widget.setData('noOutput', noOutput);

    // Clears the code output in dialog
    cm.setValue('print(\'Hello world!\')');
    document.querySelector('.cke_dialog_contents .thebelab-run-button').click();
  },
});

export default dialogConfig;
