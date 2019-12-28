import '../styles/plugin.scss';
import activateThebelab from './activateThebelab';

const thebelabConfig = {
  // this will speed up the process
  requestKernel: true,
};

const languageDictionary = {
  'Python 3': ['python3'],
  Julia: ['julia'],
  R: ['R'],
  Octave: ['octave'],
  SageMath: ['SageMath'],
};

const editScriptAreaHTML = (language = 'python3', code = null, output = null) => (`
  <label>Edit script:</label>
  <pre data-executable="true" data-language=${language}>
    ${code === null ? 'print(\'Hello world!\')' : code}
  </pre>
  <div data-output="true">
    ${output === null ? 'Hello world!' : output}
  </div>
`);

const getOutputElement = () => document.querySelector('.cke_dialog_contents .jp-OutputArea-output');
const getCodeMirror = () => document.querySelector('.cke_dialog_contents .thebelab-input .CodeMirror').CodeMirror;

const dialogConfig = (editor) => ({
  title: 'Insert Interactive Script',
  minHeight: 100,
  minWidth: 400,
  onShow() {
    activateThebelab(thebelabConfig);
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
            element.setHtml(
              editScriptAreaHTML(
                languageDictionary[this.getValue()],
                getCodeMirror().getValue(),
                getOutputElement().innerHTML,
              ),
            );

            activateThebelab(thebelabConfig);
          },
        },
        {
          type: 'html',
          id: 'code',
          html: editScriptAreaHTML(),
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
      ],
    },
  ],
  onOk() {
    const dialog = this;
    const language = languageDictionary[dialog.getValueOf('tab-basic', 'language')];
    const noOutput = dialog.getValueOf('tab-basic', 'no-output');
    const noCode = dialog.getValueOf('tab-basic', 'no-code');
    const cm = getCodeMirror();
    const code = cm.getValue();

    // creates code block to be inserted into text editor
    if (!noCode) {
      const codeBlock = editor.document.createElement('pre');
      codeBlock.setAttribute('data-executable', 'true');
      codeBlock.setAttribute('data-language', language);
      codeBlock.setText(code);
      editor.insertElement(codeBlock);
    }

    // create output block
    if (!noOutput) {
      let output = getOutputElement();
      if (output) {
        // the output will contain a pre tag if run by binder
        if (output.children.length !== 0 && output.children[0].tagName === 'PRE') {
          output = output.children[0].innerHTML;
        } else {
          output = output.innerHTML;
        }

        const outputBlock = editor.document.createElement('div');
        outputBlock.setAttribute('data-output', 'true');
        outputBlock.setHtml(output);
        editor.insertElement(outputBlock);
      }
    }

    // Clears the code output in dialog
    cm.setValue('print(\'Hello world!\')');
    document.querySelector('.cke_dialog_contents .thebelab-run-button').click();
  },
});

const loadPlugin = () => {
  CKEDITOR.plugins.add('enableBinder', {
    init: (editor) => {
      editor.addCommand('openDialog', new CKEDITOR.dialogCommand('binderDialog'));
      editor.ui.addButton('enableBinder', {
        label: 'Enable Binder',
        command: 'openDialog',
        toolbar: 'insert',
        icon: 'https://binderhub.readthedocs.io/en/latest/_static/favicon.png',
      });
      CKEDITOR.dialog.add('binderDialog', dialogConfig);
    },
  });

  CKEDITOR.config.extraPlugins = 'enableBinder';
};

export default loadPlugin;
