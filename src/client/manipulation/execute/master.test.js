/**
 * Proudly created by ohad on 21/12/2016.
 */
let $         = require('../../common/util/dom'),
    BaseError = require('../../common/log/base.error'),
    expect    = require('chai').expect,
    Executor  = require('./master');

describe('Executor', function () {
  this.timeout(100);
  let form, input, id = 0;
  before(() => {
    Executor.register(require('./dom/form'));
    form = document.createElement('form');
    form.setAttribute('id', 'form');
    $('body').appendChild(form);
    input = document.createElement('input');
    input.setAttribute('id', 'input');
    form.appendChild(input);
  });
  after(() => {
    form.parentNode.removeChild(form);
  });
  beforeEach(() => {
    ++id;
    input.blur();
    expect(document.activeElement).to.not.equal(input);
  });
  it('preconditions', () => {
    const input2 = input.cloneNode();
    input2.setAttribute('id', 'input2');
    form.appendChild(input2);
    expect(() => {Executor.execute('form', {target: '#input2'})}).to.not.throw(Error);
    expect(() => {Executor.execute('form', {target: '#input2', on: true})}).to.not.throw(Error);
    expect(() => {
      Executor.execute('form', {target: '#input2', on: true, once: true})
    }).to.not.throw(Error);
    expect(() => {
      Executor.execute('form', {target: '#input2', on: 'bla-bla'})
    }).to.not.throw(Error);
    expect(() => {
      Executor.execute('form', {target: '#input2', on: true, off: 'bal-bla'})
    }).to.not.throw(Error);
    expect(() => {
      Executor.execute('form', {
        target: '#input2',
        on    : {event: 'yo', target: 'body'},
        off   : {event: 'bro', target: 'body', id: 'the-next-app'}
      })
    }).to.not.throw(Error);
    // Should throw.
    expect(() => {Executor.execute('form', {target: '#input2', id: {}})}).to.throw(BaseError);
    expect(() => {Executor.execute('form', {target: '#input2', on: () => {}})}).to.throw(BaseError);
    expect(() => {
      Executor.execute('form', {target: '#input2', on: true, once: () => {}})
    }).to.throw(BaseError);
    expect(() => {
      Executor.execute('form', {target: '#input2', on: true, off: () => {}})
    }).to.throw(BaseError);
    expect(() => {
      Executor.execute('form', {
        target: '#input2',
        on    : {event: 1, target: 'body'}
      })
    }).to.throw(Error);
    expect(() => {
      Executor.execute('form', {
        target: '#input2',
        on    : {event: 'yo', target: 1}
      })
    }).to.throw(Error);
    expect(() => {
      Executor.execute('form', {
        target: '#input2',
        on    : true,
        off   : {event: 1, target: 'body'}
      })
    }).to.throw(Error);
    expect(() => {
      Executor.execute('form', {
        target: '#input2',
        on    : true,
        off   : {event: 'yo', target: 1}
      })
    }).to.throw(Error);
    expect(() => {Executor.execute('form', {target: '#input2', toLog: {}})}).to.throw(BaseError);
    form.removeChild(input2);
  });
  it('register fails', () => {
    expect(() => {Executor.register({})}).to.throw(BaseError);
  });
  it('execute', () => {
    Executor.execute('form', {target: '#input', focus: true});
    expect(document.activeElement).to.be.equal(input);
  });
  it('on', (done) => {
    Executor.execute('form', {target: '#input', id: id, focus: true, on: true});
    $.trigger(Executor.eventName('form'), 'nada');
    setTimeout(() => {
      expect(document.activeElement).to.not.equal(input);
      $.trigger(Executor.eventName('form'), id);
      setTimeout(() => {
        expect(document.activeElement).to.be.equal(input);
        done();
      });
    });
  });
  it('on as a string', (done) => {
    Executor.execute('form', {target: '#input', id: id, focus: true, on: 'woohoo'});
    $.trigger(Executor.eventName('form'), id);
    setTimeout(() => {
      expect(document.activeElement).to.not.equal(input);
      $.trigger('woohoo');
      setTimeout(() => {
        expect(document.activeElement).to.be.equal(input);
        done();
      });
    });
  });
  it('on with object', (done) => {
    Executor.execute('form', {
      target: '#input', id: id, focus: true,
      on    : {event: 'messiah-came', target: 'body'}
    });
    $.trigger('messiah-came', id);
    setTimeout(() => {
      expect(document.activeElement).to.not.equal(input);
      $.trigger('messiah-came', id, 'body');
      setTimeout(() => {
        expect(document.activeElement).to.be.equal(input);
        done();
      });
    });
  });
  it('once', (done) => {
    Executor.execute('form', {target: '#input', id: id, focus: true, on: true, once: true});
    $.trigger(Executor.eventName('form'), id);
    setTimeout(() => {
      expect(document.activeElement).to.be.equal(input);
      input.blur();
      $.trigger(Executor.eventName('form'), id);
      setTimeout(() => {
        expect(document.activeElement).to.not.equal(input);
        done();
      });
    });
  });
  it('off', (done) => {
    Executor.execute('form', {target: '#input', id: id, focus: true, on: true, off: 'enough'});
    $.trigger('enough');
    setTimeout(() => {
      $.trigger(Executor.eventName('form'), id);
      setTimeout(() => {
        expect(document.activeElement).to.not.equal(input);
        done();
      });
    });
  });
  it('off with object', (done) => {
    Executor.execute('form', {
      target: '#input', id: id, focus: true, on: true,
      off   : {event: 'no-more', id: 'i-am-who-i-am', target: 'body'}
    });
    $.trigger('no-more');
    setTimeout(() => {
      $.trigger(Executor.eventName('form'), id);
      setTimeout(() => {
        expect(document.activeElement).to.equal(input);
        input.blur();
        $.trigger('no-more', 'not-me', 'body');
        setTimeout(() => {
          $.trigger(Executor.eventName('form'), id);
          setTimeout(() => {
            expect(document.activeElement).to.equal(input);
            input.blur();
            $.trigger('no-more', 'i-am-who-i-am');
            setTimeout(() => {
              $.trigger(Executor.eventName('form'), id);
              setTimeout(() => {
                expect(document.activeElement).to.equal(input);
                input.blur();
                $.trigger('no-more', 'i-am-who-i-am', 'body');
                setTimeout(() => {
                  $.trigger(Executor.eventName('form'), id);
                  setTimeout(() => {
                    expect(document.activeElement).to.not.equal(input);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});