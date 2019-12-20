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

const dialogConfig = () => ({
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
          html: `
            <label>Edit script:</label>
            <pre data-executable="true">
              print('Hello world!')
            </pre>
          `,
        },
      ],
    },
  ],
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
