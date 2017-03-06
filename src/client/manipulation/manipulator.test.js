/**
 * Proudly created by ohad on 20/12/2016.
 */
let _             = require('./../common/util/wrapper'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    Manipulator   = require('./manipulator'),
    StyleExecutor = require('./execute/dom/style'),
    Demographics  = require('./experiment/demographics'),
    Experiment    = require('./experiment/experiment'),
    Storage       = require('../common/storage/storage'),
    InMemory      = require('../common/storage/in-memory.storage');

chai.use(require('chai-spies'));

describe('Manipulator', function () {
  let clientGroup, clientGroup2, nonClientGroup, subject, div, a, span, id, name;
  before(() => {
    id = 0;
    Storage.set(Storage.names.IN_MEMORY);
    InMemory.flush();
    div = document.createElement('div');
    div.setAttribute('id', 'manipulator');
    document.querySelector('body').appendChild(div);
    span             = document.createElement('span');
    span.textContent = 'Screw it,';
    div.appendChild(span);
    a             = document.createElement('a');
    a.textContent = 'Let\'s do it!';
    div.appendChild(a);
    name           = 'reaction';
    subject        = {
      dataProps: {name: name, selector: '#manipulator>span'},
      anchor   : {selector: '#manipulator>a', event: 'click'}
    };
    clientGroup    = {
      label       : 'client',
      executors   : [
        {
          name   : StyleExecutor.name,
          options: {css: '#manipulator>span {margin-top: 10px}'}
        }
      ],
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 1
      }]
    };
    clientGroup2   = {
      label       : 'client2',
      executors   : [
        {
          name   : StyleExecutor.name,
          options: {css: '#manipulator>span {margin-left: 10px}'}
        }
      ],
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 1
      }]
    };
    nonClientGroup = {
      label       : 'non-client',
      executors   : [
        {
          name   : StyleExecutor.name,
          options: {css: '#manipulator>span {margin-bottom: 10px}'}
        }
      ],
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1
      }]
    };
  });
  afterEach(() => {
    InMemory.flush();
    // Clean all injected styles.
    document.querySelectorAll('style[' + _.css.identifyingAttribute + ']')
            .forEach(function (styleElement) {
              styleElement.parentNode.removeChild(styleElement);
            });
    id++;
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('experiment runs', () => {
    Manipulator.experiment(new Experiment({id: id, groups: [clientGroup, nonClientGroup]}));
    console.log(InMemory.storage, null, '\t');
    // Participation in experiment.
    expect(InMemory.storage[0].experiment.id).to.equal(id);
    expect(InMemory.storage[0].experiment.included).to.be.true;
    // Participation in group.
    expect(InMemory.storage[1].experimentGroup.experimentId).to.equal(id);
    expect(InMemory.storage[1].experimentGroup.included).to.be.true;
    // Manipulations run.
    expect(getComputedStyle(span).marginTop).to.equal('10px');
    // Manipulations doesn't run for non client groups.
    expect(getComputedStyle(span).marginBottom).to.equal('0px');
  });
  it('experiment with subject', (done) => {
    Manipulator.experiment(new Experiment({id: id, groups: [clientGroup]}), subject);
    _.trigger('click', id, a);
    setTimeout(() => {
      const msg = InMemory.storage[InMemory.storage.length - 1];
      expect(msg).to.include.all.keys('experiment', 'experimentGroup', 'anchor', 'subject');
      expect(msg.subject[name]).to.equal(span.textContent);
      done();
    });
  });
  it('experiment without participation', () => {
    Manipulator.experiment(new Experiment({id: id, groups: [nonClientGroup]}));
    expect(InMemory.storage[0].experiment.included).to.be.true;
    expect(InMemory.storage[0]).to.not.include.keys('experimentGroup');
    // Manipulations doesn't run.
    expect(getComputedStyle(span).marginTop).to.equal('0px');
  });
  it('experiment without participation, but with subject', (done) => {
    Manipulator.experiment(new Experiment({id: id, groups: [nonClientGroup]}), subject);
    _.trigger('click', id, a);
    setTimeout(() => {
      const msg = InMemory.storage[InMemory.storage.length - 1];
      expect(msg).to.include.all.keys('experiment', 'anchor', 'subject');
      expect(msg).to.not.include.keys('experimentGroup');
      expect(msg.subject[name]).to.equal(span.textContent);
      done();
    });
  });
  it('experiment with multiple groups', (done) => {
    Manipulator.experiment(new Experiment({id: id, groups: [clientGroup, clientGroup2]}), subject);
    // Participation in group.
    expect(InMemory.storage[1].experimentGroup.experimentId).to.equal(id);
    expect(InMemory.storage[1].experimentGroup.label).to.equal(clientGroup.label);
    expect(InMemory.storage[2].experimentGroup.experimentId).to.equal(id);
    expect(InMemory.storage[2].experimentGroup.label).to.equal(clientGroup2.label);
    _.trigger('click', id, a);
    setTimeout(() => {
      const msg  = InMemory.storage[InMemory.storage.length - 1];
      const msg2 = InMemory.storage[InMemory.storage.length - 2];
      expect(msg).to.include.all.keys('experiment', 'experimentGroup', 'anchor', 'subject');
      expect(msg2).to.include.all.keys('experiment', 'experimentGroup', 'anchor', 'subject');
      done();
    });
  });
});
