const webpackEventColors = {
  ok: `#39d183`, // green (connected and idle)
  invalid: `#a081ea`, // purple (compiling)
  warnings: `#dd731d`, // orange
  errors: `#e4567b`, // red
  close: `#9bacbf`, // grey (socket disconnected)
};
Object.assign(webpackEventColors, window.__webpackEventColors__);

const webpackEventStyles = {
	borderWidth: `2px 0 0 0`,
	borderStyle: `solid`,
	borderColor: '{webpackEventColor}'
};
Object.assign(webpackEventStyles, window.__webpackEventStyles__);

const webpackEventElem = window.__webpackEventElem__ || document.body;

window.addEventListener(`message`, event => {
  const webpackPrefix = `webpack`;
  const eventType = event.data.type;
  if (eventType && eventType.startsWith(webpackPrefix)) {
    const webpackEvent = eventType.substr(webpackPrefix.length).toLowerCase();
	const styles = renderStyles(webpackEventStyles, webpackEventColors[webpackEvent]);
    Object.assign(webpackEventElem.style, styles);
  }
});

function renderStyles(styles, color) {
  for (const [key, value] of Object.entries(styles)) {
    styles[key] = value.replace('{webpackEventColor}', color);
  }
  return styles;
}

