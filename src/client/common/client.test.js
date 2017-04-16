/**
 * Proudly created by ohad on 01/02/2017.
 */
const expect = require('chai').expect,
      Client = require('./client');

describe('Client', function () {
  it('init', () => {
    Client.init();
    expect(Number.isInteger(Client.id)).to.be.true;
  });
  it('agent', () => {
    expect(Client.agent).to.be.ok;
    expect(Client.agent.browser).to.be.ok;
    expect(Client.agent.os).to.be.ok;
  });
});