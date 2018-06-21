// @ts-check
/** @type {string} */
const webpackStatusElemId = window[`__webpackStatusElemId__`] || `__webpack_status_bar__`;

/** @type {HTMLElement} */
let webpackStatusElem = window[`__webpackStatusElem__`] || document.getElementById(webpackStatusElemId);

/** @type {{[color: string]: string}} */
const webpackStatusColors = Object.assign({
  ok: `#39d183`, // green (connected and idle)
  invalid: `#a081ea`, // purple (compiling)
  warnings: `#dd731d`, // orange
  errors: `#e4567b`, // red
  close: `#9bacbf`, // grey (socket disconnected)
  progress: `#39d1cf`, // aqua
}, window[`__webpackStatusColors__`]);

/**
 * @typedef {object} WebpackStatus
 * @prop {string} event - name of event e.g `ok`, `invalid` `warnings` e.t.c
 * @prop {string} color - css color from webpackStatusColors
 * @prop {number} progress - progress percentage if event is `progress` else 100
 * @prop {string} message - a progress message e.g `compiling`, `emitting` e.t.c
 *
 * @typedef {{[prop: string]: any}} WebpackStatusStyle
 *
 * @param {WebpackStatus} status
 * @returns {WebpackStatusStyle} - a styles property bag
 */
function getWebpackStatusStyle(status) {
  return {
    backgroundColor: `${status.color}`,
    height: `2px`,
    position: `fixed`,
    top: `0px`,
    width: `${status.progress}vw`,
  };
}

/** @type {(status: WebpackStatus) => WebpackStatusStyle} */
const webpackStatusStyleFunction = window[`__webpackStatusStyleFunction__`] || getWebpackStatusStyle;


// webpack-dev-server sends messages with `webpack` prefix via postMessage
// we handle the message and display a status bar on the top of the page
window.addEventListener(`message`, event => {
  const webpackEventPrefix = `webpack`;
  const {type: eventType, data: eventData = {}} = event.data;

  if (eventType && eventType.startsWith(webpackEventPrefix)) {
    const event = eventType.substr(webpackEventPrefix.length).toLowerCase();
    const progress = (event === `progress`) ? eventData.percent : 100;
    const color = webpackStatusColors[event] || webpackStatusColors.invalid;
    const message = eventData.msg || ``;

    // create a div node with id, if there is no user defined status elem found
    if (!webpackStatusElem) {
      webpackStatusElem = document.createElement(`div`);
      webpackStatusElem.setAttribute(`id`, webpackStatusElemId);
      document.body.appendChild(webpackStatusElem);
    }

    // assign computed style to status bar
    const statusStyle = webpackStatusStyleFunction({event, color, progress, message});
    Object.assign(webpackStatusElem.style, statusStyle);

    // using setAttribute instead of dataset to support [data-*] selectors
    webpackStatusElem.setAttribute(`data-webpack-status`, event);
  }
});
