/**
 * Proudly created by ohad on 01/01/2017.
 */
const chromedriver = require('chromedriver');
//noinspection JSUnusedGlobalSymbols
module.exports     = {
    'default': {
        isLocal: true,
    },

    'integration': {
        isLocal: false
    },

    // External before hook is ran at the beginning of the tests run, before creating the Selenium
    // session
    before: function (done) {
        // run this only for the local-env
        if (this.isLocal) {
            chromedriver.start();
            done();
        } else {
            done();
        }
    },

    // External after hook is ran at the very end of the tests run, after closing the Selenium
    // session
    after: function (done) {
        // run this only for the local-env
        if (this.isLocal) {
            chromedriver.stop();
            done();
        } else {
            done();
        }
    },

    // This will be run before each test suite is started
    beforeEach: function (browser, done) {
        // getting the session info
        browser.status(function (result) {
            console.log(result.value);
            done();
        });
    },

    // This will be run after each test suite is finished
    afterEach: function (browser, done) {
        console.log(browser.currentTest);
        done();
    }
};