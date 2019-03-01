const { h, render } = require('preact');
const { getTimelineSections } = require('./loader');

function init() {
  // Fix some weird styling that the footer kills
  const firstSubcolumn = document.querySelector('.subcolumns');
  if (firstSubcolumn) {
    firstSubcolumn.style.setProperty('overflow', 'visible');
  }

  const App = require('./components/App');
  getTimelineSections().forEach(section => {
    render(<App section={section} />, section.mountNode, section.mountNode.firstChild);
  });
}

init();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');
      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
  console.debug(`[Timelines] public path: ${__webpack_public_path__}`);
}
