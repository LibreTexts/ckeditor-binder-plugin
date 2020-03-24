const codeHtml = (code, language, noCode = false) => {
  if (noCode) {
    return `<pre data-language="${language}" class="no-code">${code}</pre>`;
  }

  return `<pre data-executable="true" data-language="${language}">${code}</pre>`;
};

const widgetHtml = (data) => {
  const {
    code,
    output,
    language,
    noCode,
    noOutput,
  } = data;

  const outputHtml = `
    <div data-output="true">
      ${output}
    </div>
  `;

  return `
    ${codeHtml(code, language, noCode)}
    ${noOutput ? '' : outputHtml}
  `;
};

// somehow if we don't remove the extra spaces
// in front, CKEditor will not like it.
// use trim() here to remove the spaces.
const template = `
  <div class="thebelab">
    <pre data-executable="true" data-language="python3">
      print('hello world')
    </pre>
    <div data-output="true">
      hello world
    </div>
  </div>
`.trim();

const widgetConfig = {
  // This sets `binderDialog` as the dialog related
  // the dialog will appear when first trying to insert
  // a widget (when the user clicks the button to insert).
  // It will also appear when the user wants to edit
  // the widget (the default trigger is by double clicking
  // or pressing the button again when a widget is selected.
  dialog: 'binderDialog',

  // Data for widgets are not preversed when
  // recasting. For example if the user presses `source`
  // and then come back, the editor will init a new widget.
  // So we need to use the HTML element to reset the data.
  init() {
    const preTag = this.element.findOne('pre');
    if (preTag) {
      this.setData('noCode', preTag.hasClass('no-code'));
      this.setData('language', preTag.getAttribute('data-language'));
      this.setData('code', preTag.getHtml());
    }

    const outputDiv = this.element.findOne('div[data-output=true]');
    this.setData('noOutput', outputDiv === null);
    if (outputDiv) {
      this.setData('output', outputDiv.getHtml());
    }

    // every time each widget is edited, it should pass it to
    // the dialog so that the dialog can access it. this is done
    // in here https://github.com/ckeditor/ckeditor4/blob/master/plugins/widget/plugin.js#L1217
    // However, it is not not supported on older versions
    // here is a hack that attaches it as a global var
    this.on('edit', () => {
      window.ckeditorBinderPlugin.currentWidget = this;
    });
  },
  template,

  // data is called whenever widget.data is changed.
  // this is typically triggered by `this.setData()`
  data() {
    const { data, element } = this;
    element.setHtml(widgetHtml(data));
  },
  downcast(element) {
    return element;
  },
  upcast(element) {
    return element.hasClass('thebelab');
  },
};

export default widgetConfig;
