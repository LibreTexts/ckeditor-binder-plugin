const widgetHtml = (data) => {
  const {
    code,
    output,
    language,
    noCode,
    noOutput,
  } = data;

  const codeHtml = `
    <pre data-executable="true" data-language="${language}">${code}</pre>
   `;

  const outputHtml = `
    <div data-output="true">
      ${output}
    </div>
  `;

  return `
    <div class="thebelab">
      ${noCode ? '' : codeHtml}
      ${noOutput ? '' : outputHtml}
    </div>
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
  dialog: 'binderDialog',
  // data for widgets are not preversed when
  // recasting, so need to reset the data
  init() {
    const preTag = this.element.findOne('pre[data-executable=true]');
    this.setData('noCode', preTag === null);
    if (preTag) {
      this.setData('language', preTag.getAttribute('data-language'));
      this.setData('code', preTag.getHtml());
    }

    const outputDiv = this.element.findOne('div[data-output=true]');
    this.setData('noOutput', outputDiv === null);
    if (outputDiv) {
      this.setData('output', outputDiv.getHtml());
    }
  },
  template,
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
