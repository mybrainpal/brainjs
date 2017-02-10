/**
 * Proudly created by ohad on 27/01/2017.
 */
const expect    = require('chai').expect,
      fse       = require('fs-extra'),
      path      = require('path'),
      Util      = require('./util'),
      Constants = require('./const');

describe('CommonUtil', function () {
  const testDirPath           = path.join(__dirname, Constants.TEST_CONTEXT),
        originalClientContext = Constants.CLIENT_CONTEXT;
  before(() => {
    Constants.CLIENT_CONTEXT = testDirPath;
    expect(fse.existsSync(testDirPath)).to.be.false;
    fse.mkdirSync(testDirPath);
  });
  after(() => {
    fse.removeSync(testDirPath);
    Constants.CLIENT_CONTEXT = originalClientContext;
  });
  it('webpack entries', () => {
    const configDir = path.join(testDirPath, Constants.CUSTOMER_CONFIGS_DIR);
    fse.mkdirSync(configDir);
    fse.writeFileSync(path.join(configDir, 'a.js'), '');
    fse.writeFileSync(path.join(configDir, 'b.js'), '');
    expect(Util.webpackEntries()).to.deep.equal(
      {
        a: './' + path.join(Constants.CUSTOMER_CONFIGS_DIR, 'a.js'),
        b: './' + path.join(Constants.CUSTOMER_CONFIGS_DIR, 'b.js'),
      });
    fse.removeSync(configDir);
  });
  it('webpack entries - sub path', () => {
    const configDir    = path.join(testDirPath, Constants.CUSTOMER_CONFIGS_DIR);
    const configDevDir = path.join(configDir, Constants.devDistDir);
    fse.mkdirSync(configDir);
    fse.mkdirSync(configDevDir);
    fse.writeFileSync(path.join(configDevDir, 'a.js'), '');
    fse.writeFileSync(path.join(configDevDir, 'b.js'), '');
    expect(Util.webpackEntries(Constants.devDistDir)).to.deep.equal(
      {
        a: './' + path.join(Constants.CUSTOMER_CONFIGS_DIR, Constants.devDistDir, 'a.js'),
        b: './' + path.join(Constants.CUSTOMER_CONFIGS_DIR, Constants.devDistDir, 'b.js'),
      });
    fse.removeSync(configDir);
  });
});