/**
 * Proudly created by ohad on 04/12/2016.
 *
 * Properties of the lucky client running BrainPal.
 */
const _ = require('../common/util/wrapper');

/**
 * Initializes client properties.
 */
exports.init = function () {
  if (_.isNil(exports.id)) exports.id = Math.round(Math.random() * 1000000) + 1;
};

/**
 * Primary identifier.
 * @type {number}
 */
exports.id = 0;

/**
 * Identifier of current tracker, you may think of it as a customer ID, or should we say a lucky
 * customer!
 * @type {string|number}
 */
exports.trackerId = '';

/**
 * All experiments that had been loaded from the customer's configuration. Note that the client
 * may not participate in all or any of them.
 * @type {Array.<Experiment>}
 */
exports.experiments = [];

/**
 * Browser, OS and their major version.
 * @type {{
    browser: string,
    browserVersion: number,
    mobile: boolean,
    os: string,
    osVersion: string
   }}
 */
exports.agent = _parseUserAgent();

/**
 * @returns {boolean} whether the client and BrainPal can be friends (hey! at least we tried!).
 */
exports.canRunBrainPal = function () {
  let i;
  let browserToMinVersions = {
    'edge'   : 14,
    'chrome' : 53,
    'safari' : 9,
    'firefox': 50,
    'opera'  : 40
  };
  let allowedOs            = ['windows', 'ios', 'android', 'mac'];
  if (!browserToMinVersions.hasOwnProperty(exports.agent.browser.toLowerCase())) {
    return false;
  }
  if (exports.agent.browserVersion < browserToMinVersions[exports.agent.browser.toLowerCase()]) {
    return false;
  }
  for (i = 0; i < allowedOs.length; i++) {
    if (exports.agent.os.toLowerCase().indexOf(allowedOs[i]) !== -1) {
      return true;
    }
  }
  return false;
};

/**
 * Whether the browser has cookies enabled.
 * @type {boolean}
 */
exports.cookiesEnabled = (function () {
  let cookieEnabled = navigator.cookieEnabled;

  if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled   = document.cookie.indexOf('testcookie') !== -1;
  }
  return cookieEnabled;
})();

/**
 * (C) viazenetti GmbH (Christian Ludwig)
 * Parses the user agent.
 * @returns {{
 *  browser: string,
 *  browserVersion: number,
 *  mobile: boolean,
 *  os: string,
 *  osVersion: string
 * }}
 * @private
 */
function _parseUserAgent() {
  let cs,
      id,
      osVersion,
      clientStrings,
      mobile,
      os,
      verOffset, ix,
      majorVersion,
      version,
      browser,
      nVer,
      nAgt,
      unknown = '';

  // browser
  nVer    = navigator.appVersion;
  nAgt    = navigator.userAgent;
  browser = navigator.appName;
  version = '' + parseFloat(navigator.appVersion);

  // Opera
  if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Opera Next
  if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 4);
  }
  // Edge
  else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
    browser = 'Microsoft Edge';
    version = nAgt.substring(verOffset + 5);
  }
  // Chrome
  else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
    browser = 'Chrome';
    version = nAgt.substring(verOffset + 7);
  }
  // Safari
  else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
    browser = 'Safari';
    version = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Firefox
  else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
    browser = 'Firefox';
    version = nAgt.substring(verOffset + 8);
  }
  // trim the version string
  if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

  majorVersion = parseInt('' + version, 10);
  if (isNaN(majorVersion)) {
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  // mobile version
  mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

  // system
  os            = unknown;
  clientStrings = [
    {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
    {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
    {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
    {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
    {s: 'Windows Vista', r: /Windows NT 6.0/},
    {s: 'Android', r: /Android/},
    {s: 'iOS', r: /(iPhone|iPad|iPod)/},
    {s: 'Mac OS X', r: /Mac OS X/},
    {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
  ];
  for (id in clientStrings) {
    if (clientStrings.hasOwnProperty(id)) {
      cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }
  }

  osVersion = unknown;

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os        = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      osVersion = /Mac OS X (10[._\d]+)/.exec(nAgt)[1];
      break;

    case 'Android':
      osVersion = /Android ([._\d]+)/.exec(nAgt)[1];
      break;

    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
      osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
      break;
  }

  return {
    browser       : browser,
    browserVersion: majorVersion,
    mobile        : mobile,
    os            : os,
    osVersion     : osVersion
  };
}
