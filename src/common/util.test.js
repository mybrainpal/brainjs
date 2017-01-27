/**
 * Proudly created by ohad on 27/01/2017.
 */
const expect    = require('chai').expect,
      fse       = require('fs-extra'),
      path      = require('path'),
      Util      = require('./util'),
      Constants = require('./const');

describe('CommonUtil', function () {
  const testDirPath           = path.join(__dirname, Constants.testContext),
        originalClientContext = Constants.clientContext;
  before(() => {
    Constants.clientContext = testDirPath;
    expect(fse.existsSync(testDirPath)).to.be.false;
    fse.mkdirSync(testDirPath);
  });
  after(() => {
    fse.removeSync(testDirPath);
    Constants.clientContext = originalClientContext;
  });
  it('webpack entries', () => {
    const configDir = path.join(testDirPath, Constants.configurationDir);
    fse.mkdirSync(configDir);
    fse.writeFileSync(path.join(configDir, 'a.js'), '');
    fse.writeFileSync(path.join(configDir, 'b.js'), '');
    expect(Util.webpackEntries()).to.deep.equal(
      {
        a: './' + path.join(Constants.configurationDir, 'a.js'),
        b: './' + path.join(Constants.configurationDir, 'b.js'),
      });
  })
});