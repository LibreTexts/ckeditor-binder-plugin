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

CKEDITOR.plugins.add('enableBinder', {
  init: (editor) => {
    editor.addCommand('insertPreWithBinder', { exec: insertPreWithBinder });
    editor.ui.addButton('enableBinder', {
      label: 'Enable Binder',
      command: 'insertPreWithBinder',
      toolbar: 'editing',
      icon: 'https://binderhub.readthedocs.io/en/latest/_static/favicon.png',
    });
  },
});
