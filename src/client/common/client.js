/**
 * Proudly created by ohad on 04/12/2016.
 *
 * Properties of the lucky client running BrainPal.
 */
/**
 * Initializes with the client properties.
 * @param {Object} [options]
 */
module.exports.init = function init(options) {
    // TODO(ohad): populate with real values.
    module.exports.id = 1234;
};


/**
 * Browser, OS and their major version.
 * @type {{
 *  browser: string,
    browserVersion: number,
    mobile: boolean,
    os: string,
    osVersion: string
 * }}
 */
module.exports.agent = _parseUserAgent();

/**
 * @returns {boolean} whether the client and BrainPal can be friends (at least we tried!).
 */
module.exports.canRunBrainPal = function () {
    var i;
    var agent                = _parseUserAgent();
    var browserToMinVersions = {
        'edge'   : 14,
        'chrome' : 53,
        'safari' : 10,
        'firefox': 50,
        'opera'  : 40
    };
    var allowedOs            = ['windows', 'ios', 'android', 'mac'];
    if (!browserToMinVersions.hasOwnProperty(agent.browser.toLowerCase())) {
        return false;
    }
    if (agent.browserVersion < browserToMinVersions[agent.browser.toLowerCase()]) {
        return false;
    }
    for (i = 0; i < allowedOs.length; i++) {
        if (agent.os.toLowerCase().indexOf(allowedOs[i]) != -1) {
            return true;
        }
    }
    return false;
};

/**
 * Whether the browser has cookies enabled.
 * @type {boolean}
 */
module.exports.cookiesEnabled = (function () {
    var cookieEnabled = navigator.cookieEnabled;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled   = document.cookie.indexOf('testcookie') != -1;
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
    var cs;
    var id;
    var osVersion;
    var clientStrings;
    var mobile;
    var os;
    var nameOffset, verOffset, ix;
    var majorVersion;
    var version;
    var browser;
    var nVer;
    var nAgt;
    var unknown = '';

    // browser
    nVer    = navigator.appVersion;
    nAgt    = navigator.userAgent;
    browser = navigator.appName;
    version = '' + parseFloat(navigator.appVersion);

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

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
        {s: 'Windows Server 2003', r: /Windows NT 5.2/},
        {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
        {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
        {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
        {s: 'Windows 98', r: /(Windows 98|Win98)/},
        {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
        {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s: 'Windows CE', r: /Windows CE/},
        {s: 'Windows 3.11', r: /Win16/},
        {s: 'Android', r: /Android/},
        {s: 'Open BSD', r: /OpenBSD/},
        {s: 'Sun OS', r: /SunOS/},
        {s: 'Linux', r: /(Linux|X11)/},
        {s: 'iOS', r: /(iPhone|iPad|iPod)/},
        {s: 'Mac OS X', r: /Mac OS X/},
        {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s: 'QNX', r: /QNX/},
        {s: 'UNIX', r: /UNIX/},
        {s: 'BeOS', r: /BeOS/},
        {s: 'OS/2', r: /OS\/2/},
        {
            s: 'Search Bot',
            r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
        }
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
