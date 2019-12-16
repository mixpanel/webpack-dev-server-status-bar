/** @type {any} cast to any so tsc doesn't complain about special window vars*/
const global = window;

/** @type {string} */
const webpackStatusElemId = global.__webpackStatusElemId__ || `__webpack_status_bar__`;

/** @type {HTMLElement} */
let webpackStatusElem = global.__webpackStatusElem__ || document.getElementById(webpackStatusElemId);

/** @type {{[color: string]: string}} */
const webpackStatusColors = Object.assign({
  ok: `#39d183`, // green (connected and idle)
  invalid: `#a081ea`, // purple (compiling)
  warnings: `#dd731d`, // orange
  errors: `#e4567b`, // red
  close: `#9bacbf`, // grey (socket disconnected)
  progress: `#39d1cf`, // aqua
}, global.__webpackStatusColors__);

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
  // mobile devices don't deal well with position: fixed, fallback to absolute if it looks like touch device
  const position = window.navigator.maxTouchPoints > 0 ? `absolute`: `fixed`;
  return {
    backgroundColor: `${status.color}`,
    height: `2px`,
    position,
    top: `0px`,
    width: `${status.progress}vw`,
    zIndex: 2147483647, // max z-index :)
  };
}

/** @type {(status: WebpackStatus) => WebpackStatusStyle} */
const webpackStatusStyleFunction = global.__webpackStatusStyleFunction__ || getWebpackStatusStyle;

/**
 * if this is executed as part of a script in <head>, then body may not be initialized
 * wait for ready state to be interactive, which means html is parsed and document.body is available
 * @returns {Promise<HTMLElement>}
 */
function waitForBody() {
  return new Promise(resolve => {
    if (document.body) {
      resolve(document.body);
    } else {
      /** @type {(ev: any) => void} */
      const readyStateChangeListener = ev => {
        if (ev.target.readyState === `interactive`) {
          document.removeEventListener(`readystatechange`, readyStateChangeListener);
          resolve(document.body);
        }
      };
      document.addEventListener(`readystatechange`, readyStateChangeListener);
    }
  });
}

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
      waitForBody().then(body => body.appendChild(webpackStatusElem));
    }

    // assign computed style to status bar
    const statusStyle = webpackStatusStyleFunction({event, color, progress, message});
    Object.assign(webpackStatusElem.style, statusStyle);

    // using setAttribute instead of dataset to support [data-*] selectors
    webpackStatusElem.setAttribute(`data-webpack-status`, event);
  }
});
