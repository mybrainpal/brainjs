/**
 * Proudly created by ohad on 30/12/2016.
 */
let _             = require('../../../common/util/wrapper'),
    BaseError     = require('../../../common/log/base.error'),
    expect        = require('chai').expect,
    TyperExecutor = require('./typer');

describe('TyperExecutor', function () {
  this.timeout(500);
  let div;
  beforeEach(() => {
    div = _.div({id: 'div'});
    document.querySelector('body').appendChild(div);
  });
  afterEach(() => {
    div.parentNode.removeChild(div);
  });
  it('preconditions', () => {
    expect(() => {TyperExecutor.preconditions({typerFn: () => {}})}).to.not.throw(Error);
    expect(() => {TyperExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {TyperExecutor.preconditions({typerFn: 1})}).to.throw(BaseError);
  });
  it('new line', (done) => {
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).line('123').end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('123');
      done();
    }, 200);
  });
  it('new line html', (done) => {
    TyperExecutor.execute(
      {typerFn: (typer) => {typer('#div', 1).line(`<span>123</span>`)}});
    setTimeout(() => {
      expect(div.textContent).to.equal('123');
      expect(div.querySelector('span')).to.be.ok;
      done();
    }, 50);
  });
  it('back', (done) => {
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).line('123').back(2).end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('1');
      done();
    }, 50);
  });
  it('back existing content', (done) => {
    div.innerHTML = '123';
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).back(2).end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('1');
      done();
    }, 50);
  });
  it('back html', (done) => {
    TyperExecutor.execute(
      {typerFn: (typer) => {typer('#div', 1).line(`<span>123</span>`).back(1).end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('12');
      expect(div.querySelector('span')).to.be.ok;
      done();
    }, 50);
  });
  it('cursor', (done) => {
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 5).line('123').end();}});
    setTimeout(() => {
      expect(div.querySelector(`[class^='cursor']`)).to.be.ok;
      setTimeout(() => {
        expect(div.querySelector(`[class^='cursor']`)).to.not.be.ok;
        done();
      }, 30)
    }, 5);
  });
  it('continue', (done) => {
    TyperExecutor.execute(
      {typerFn: (typer) => {typer('#div', 1).line('1').continue('23').end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('123');
      done();
    }, 50);
  });
  it('continue from empty', (done) => {
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).continue('123').end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('123');
      done();
    }, 50);
  });
  it('pause', (done) => {
    TyperExecutor.execute(
      {typerFn: (typer) => {typer('#div', 1).line('1').pause(100).continue('23').end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('1');
      setTimeout(() => {
        expect(div.textContent).to.equal('123');
        done();
      }, 200)
    }, 20);
  });
  it('pause from empty', (done) => {
    TyperExecutor.execute(
      {typerFn: (typer) => {typer('#div', 1).pause(100).continue('123').end()}});
    setTimeout(() => {
      expect(div.textContent).to.equal('');
      setTimeout(() => {
        expect(div.textContent).to.equal('123');
        done();
      }, 200);
    }, 20);
  });
  it('emit', (done) => {
    _.on('ev', () => {done()});
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).emit('ev').end();}});
  });
  it('listen', (done) => {
    TyperExecutor.execute(
      {typerFn: (typer) => {typer('#div', 1).listen('ev').continue('123').end();}});
    setTimeout(() => {
      expect(div.textContent).to.equal('');
      _.trigger('ev');
      setTimeout(() => {
        expect(div.textContent).to.equal('123');
        done();
      }, 30);
    }, 5);
  });
  it('empty', (done) => {
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).line('123').empty().end();}});
    setTimeout(() => {
      expect(div.textContent).to.equal('');
      done();
    }, 200);
  });
  it('empty as first command', (done) => {
    div.innerHTML = '123';
    TyperExecutor.execute({typerFn: (typer) => {typer('#div', 1).empty().end();}});
    setTimeout(() => {
      expect(div.textContent).to.equal('');
      done();
    }, 20);
  });
  it('run', (done) => {
    TyperExecutor.execute({
                            typerFn: (typer) => {
                              typer('#div', 1).line('123').run((el) => {
                                expect(el.textContent).to.equal('123');
                                done();
                              });
                            }
                          });
  });
  it('end', (done) => {
    _.on('typerFinished', () => {done()});
    TyperExecutor.execute({
                            typerFn: typer => {
                              typer('#div', 1).line('123').end((el) => {
                                expect(el.textContent).to.equal('123');
                              }, true)
                            }
                          });
  });
});