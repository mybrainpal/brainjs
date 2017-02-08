/**
 * Proudly created by ohad on 21/12/2Client.id + 116.
 */
let expect       = require('chai').expect,
    chai         = require('chai'),
    Client       = require('../../common/client'),
    Demographics = require('./demographics');

describe.only('Demographics', function () {
  let tmpOs, tmpUrl;
  before(() => {
    tmpOs                = Client.agent.os;
    Client.agent.os      = 'BrainOs'; // we are going to make it. period.
    tmpUrl               = window.location.href;
    window.location.href = 'brainpal.io'; // strongly recommended.
  });
  after(() => {
    Client.agent.os      = tmpOs;
    window.location.href = tmpUrl;
  });
  it('modulo', () => {
    let property = {
      name     : Demographics.PROPERTIES.MODULO.name,
      moduloIds: [Client.id],
      moduloOf : 1
    };
    expect(Demographics.included(property)).to.be.true;
    property.moduloIds = [];
    expect(Demographics.included(property)).to.be.false;
    property.moduloIds = [Client.id + 1];
    expect(Demographics.included(property)).to.be.false;
    delete property.moduloIds;
    expect(Demographics.included(property)).to.throw(Error);
    property.moduloIds = 1;
    expect(Demographics.included(property)).to.throw(Error);
    property.moduloIds = [Client.id + 1];
    delete property.moduloOf;
    expect(Demographics.included(property)).to.throw(Error);
    property.moduloOf = '1';
    expect(Demographics.included(property)).to.throw(Error);
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
    expect(Demographics.included(property)).to.throw(Error);
    property.os = 1;
    expect(Demographics.included(property)).to.throw(Error);
  });
  it('url', () => {
    let property = {
      name: Demographics.PROPERTIES.URL.name,
      url : window.location.href
    };
    expect(Demographics.included(property)).to.be.true;
    property.url = 'Facebook';
    expect(Demographics.included(property)).to.be.false;
    delete property.url;
    expect(Demographics.included(property)).to.throw(Error);
    property.url = 1;
    expect(Demographics.included(property)).to.throw(Error);
  });
  it('multiple properties', () => {
    expect(Demographics.included([
                                   {
                                     name     : Demographics.PROPERTIES.MODULO.name,
                                     moduloIds: [Client.id + 1],
                                     moduloOf : 1

                                   },
                                   {
                                     name: Demographics.PROPERTIES.OS.name, os: Client.agent.os
                                   }])).to.be.true;
    expect(Demographics.included([
                                   {
                                     name     : Demographics.PROPERTIES.MODULO.name,
                                     moduloIds: [Client.id],
                                     moduloOf : 1

                                   },
                                   {
                                     name: Demographics.PROPERTIES.OS.name, os: 'Windows'
                                   }])).to.be.false;
  });
  it('no properties', () => {
    expect(Demographics.included()).to.be.true;
  });
});
