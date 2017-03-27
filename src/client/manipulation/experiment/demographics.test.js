/**
 * Proudly created by ohad on 21/12/2Client.id + 116.
 */
let expect       = require('chai').expect,
    chai         = require('chai'),
    _            = require('../../common/util/wrapper'),
    BaseError    = require('../../common/log/base.error'),
    Client       = require('../../common/client'),
    Demographics = require('./demographics');

describe('Demographics', function () {
  let tmpAgent;
  before(() => {
    tmpAgent             = _.extend({}, Client.agent);
    Client.agent.os      = 'BrainOs'; // we are going to make it. period.
    Client.agent.browser = 'BrainMoz';
  });
  after(() => {
    Client.agent = tmpAgent;
  });
  it('modulo', () => {
    let property = {
      name     : Demographics.PROPERTIES.MODULO.name,
      moduloIds: [0],
      moduloOf : 1
    };
    expect(Demographics.included(property)).to.be.true;
    property.moduloIds = [];
    expect(Demographics.included(property)).to.be.false;
    property.moduloIds = [Client.id + 1];
    expect(Demographics.included(property)).to.be.false;
    delete property.moduloIds;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
    property.moduloIds = 1;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
    property.moduloIds = [Client.id + 1];
    delete property.moduloOf;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
    property.moduloOf = '1';
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
  });
  it('os', () => {
    let property = {
      name: Demographics.PROPERTIES.OS.name,
      os  : Client.agent.os
    };
    expect(Demographics.included(property)).to.be.true;
    property.os = 'Android';
    expect(Demographics.included(property)).to.be.false;
    delete property.os;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
    property.os = 1;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
  });
  it('browser', () => {
    let property = {
      name   : Demographics.PROPERTIES.BROWSER.name,
      browser: Client.agent.browser
    };
    expect(Demographics.included(property)).to.be.true;
    property.browser = 'Netscape';
    expect(Demographics.included(property)).to.be.false;
    delete property.browser;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
    property.browser = 1;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
  });
  it('url', () => {
    let property = {
      name: Demographics.PROPERTIES.URL.name,
      url : new RegExp(`^${window.location.href}$`)
    };
    expect(Demographics.included(property)).to.be.true;
    property.url = /Facebook/;
    expect(Demographics.included(property)).to.be.false;
    delete property.url;
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
    property.url = '1';
    expect(() => {Demographics.included(property)}).to.throw(BaseError);
  });
  it('resolution', () => {
    const dimensions = ['Width', 'Height'];
    const limits     = ['min', 'max'];
    for (let i = 0; i < dimensions.length; i++) {
      for (let j = 0; j < limits.length; j++) {
        let property       = {name: Demographics.PROPERTIES.RESOLUTION.name};
        const shift        = limits[j] === 'min' ? -1 : 1;
        const propName     = limits[j] + dimensions[i];
        property[propName] = window['inner' + dimensions[i]] + shift;
        expect(Demographics.included(property)).to.be.true;
        property[propName] = window['inner' + dimensions[i]] - shift;
        expect(Demographics.included(property)).to.be.false;
        property[propName] = '1';
        expect(() => {Demographics.included(property)}).to.throw(BaseError);
        delete property[propName];
        expect(Demographics.included(property)).to.be.true;
      }
    }
  });
  it('multiple properties', () => {
    expect(Demographics.included([
                                   {
                                     name     : Demographics.PROPERTIES.MODULO.name,
                                     moduloIds: [0],
                                     moduloOf : 1

                                   },
                                   {
                                     name: Demographics.PROPERTIES.OS.name, os: Client.agent.os
                                   }])).to.be.true;
    expect(Demographics.included([
                                   {
                                     name     : Demographics.PROPERTIES.MODULO.name,
                                     moduloIds: [0],
                                     moduloOf : 1

                                   },
                                   {
                                     name: Demographics.PROPERTIES.OS.name, os: 'Windows'
                                   }])).to.be.false;
  });
  it('no properties', () => {
    expect(Demographics.included()).to.equal(true);
  });
});
