/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect       = require('chai').expect,
    chai         = require('chai'),
    Demographics = require('./demographics');

describe('Demographics', function () {
  before(() => {
    // So that demographics apply.
    require('./../../common/client').id       = 1;
    require('./../../common/client').agent.os = 'BrainOs'; // we are going to make it. period.
  });
  it('client included', () => {
    expect(Demographics.included()).to.be.true;
    expect(Demographics.included({
                                   properties: [
                                     {
                                       name: 'modulo', moduloIds: [0], moduloOf: 1
                                     }]
                                 })).to.be.true;
    expect(Demographics.included({
                                   properties: [
                                     {
                                       name: 'modulo', moduloIds: [0], moduloOf: 1

                                     },
                                     {
                                       name: 'os', os: 'BrainOs'

                                     }]
                                 })).to.be.true;
  });
  it('client not included', () => {
    expect(Demographics.included({
                                   properties: [
                                     {
                                       name: 'modulo', moduloIds: [], moduloOf: 1
                                     }]
                                 })).to.be.false;
    expect(Demographics.included({
                                   properties: [
                                     {
                                       name: 'modulo', moduloIds: [1], moduloOf: 1
                                     }]
                                 })).to.be.false;
    expect(Demographics.included({
                                   properties: [
                                     {
                                       name: 'modulo', moduloIds: [0], moduloOf: 1

                                     },
                                     {
                                       name: 'os', os: 'Windows'
                                     }]
                                 })).to.be.false;
  });
});
