import activateThebelab from './activateThebelab';

const insertPreWithBinder = (editor) => {
  // get selected element
  const selection = editor.getSelection();
  const range = selection.getRanges()[0];
  const clone = range.cloneContents();

  // wrap selected text within a pre tag
  // todo: need to consider a case when having multiple
  //       nodes in `clone`
  const element = editor.document.createElement('pre');
  element.setAttribute('data-executable', 'true');
  element.setAttribute('class', 'code');
  element.append(clone);
  editor.insertElement(element);
};

const thebelabConfig = {
  binderOptions: {
    repo: 'binder-examples/requirements',
    binderUrl: 'https://mybinder.org',
  },
  kernelOptions: {
    name: 'python3',
  },

  // this will speed up the process
  requestKernel: true,
};

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
        },
        {
          type: 'html',
          id: 'code',
          html: `
            <label>Edit script:</label>
            <pre data-executable="true">
              print('Hello world!')
            </pre>
            <div data-output="true">
              Hello world!
            </div>
          `,
        },
      ],
    },
  ],
  onOk() {
    const dialog = this;
    const languageDictionary = {
      'Python 3': ['python'],
      Julia: ['julia'],
      R: ['R'],
      Octave: ['octave'],
    };
    const language = languageDictionary[dialog.getValueOf('tab-basic', 'language')];

    // creates code block to be inserted into text editor
    const codeBlock = editor.document.createElement('pre');
    codeBlock.setAttribute('data-executable', 'true');
    codeBlock.setAttribute('data-language', language);
    const cm = document.querySelector('.cke_dialog_contents .thebelab-input .CodeMirror').CodeMirror;
    const code = cm.getValue();
    codeBlock.setText(code);
    editor.insertElement(codeBlock);

    // create output block
    let output = document.querySelector('.cke_dialog_contents .jp-OutputArea-output');
    if (output) {
      // the output will contain a pre tag if run by binder
      if (output.children.length !== 0 && output.children[0].tagName === 'PRE') {
        output = output.children[0].innerHTML;
      } else {
        output = output.innerHTML;
      }

      const outputBlock = editor.document.createElement('div');
      outputBlock.setAttribute('data-output', 'true');
      outputBlock.setText(output);
      editor.insertElement(outputBlock);
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
