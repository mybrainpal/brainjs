/**
 * Proudly created by ohad on 08/01/2017.
 */
const _         = require('../util/wrapper'),
      expect    = require('chai').expect,
      Factory   = require('./factory'),
      WordEvent = require('./word');

describe('WordEvent', function () {
    this.timeout(200);
    let wordEvent, options, id = 0;
    let div, input;
    beforeEach(() => {
        ++id;
        div = document.createElement('div');
        document.querySelector('body').appendChild(div);
        input = document.createElement('input');
        input.setAttribute('id', 'input');
        div.appendChild(input);
        options = {target: '#input', detailOrId: id, waitTime: 10};
    });
    it('construction', () => {
        wordEvent = new WordEvent({target: '#input'});
        expect(wordEvent).to.be.instanceof(WordEvent);
        expect(wordEvent.fireOnce).to.be.true;
        expect(wordEvent.fireOnEmpty).to.be.false;
        expect(wordEvent.fireOnRegex).to.be.false;
        expect(wordEvent.enforceRegex).to.be.false;
        expect(wordEvent.fireOnEnter).to.be.true;
        expect(wordEvent.regex).to.be.deep.equal(/^[^\s]+\s$/);
        expect(wordEvent.target).to.be.equal(input);
        expect(wordEvent.waitTime).to.be.equal(2000);
    });
    it('construction should fail', () => {
        expect(() => {new WordEvent()}).to.throw(TypeError);
        expect(() => {new WordEvent({})}).to.throw(TypeError);
        expect(() => {new WordEvent({target: '#input', waitTime: '1s'})}).to.throw(TypeError);
        expect(() => {new WordEvent({target: '#input', regex: '/\s/'})}).to.throw(TypeError);
        expect(() => {new WordEvent({target: '#input', waitTime: 1.5})}).to.throw(TypeError);
        expect(() => {new WordEvent({target: 1})}).to.throw(RangeError);
        expect(() => {new WordEvent({target: '#input2'})}).to.throw(RangeError);
    });
    it('fires on idle', (done) => {
        _.on(Factory.eventName(WordEvent.name()), () => {done()}, id, input);
        wordEvent   = new WordEvent(options);
        input.value = 'a';
        _.trigger('change', id, input);
    });
    it('stops', (done) => {
        wordEvent   = new WordEvent(options);
        input.value = 'a';
        wordEvent.stop();
        _.trigger('change', id, input);
        _.on(Factory.eventName(WordEvent.name()), () => {done('come on!')}, id, input);
        _.delay(() => {done()}, 20);
    });
    it('fires once', (done) => {
        let count = 0;
        _.on(Factory.eventName(WordEvent.name()), () => {count++}, id, input);
        wordEvent   = new WordEvent({
            target: '#input', detailOrId: id, waitTime: 10, fireOnce: true, fireOnEnter: true
        });
        input.value = 'a';
        let event   = new Event('keyup', {which: 13});
        input.dispatchEvent(event);
        _.trigger('change', id, input);
        _.delay(() => {
            expect(count).to.equal(1);
            done()
        }, 50);
    });
    it('fires more than once', (done) => {
        let count = 0;
        _.on(Factory.eventName(WordEvent.name()), () => {count++}, id, input);
        wordEvent   =
            new WordEvent({target: '#input', detailOrId: id, waitTime: 10, fireOnce: false});
        input.value = 'a';
        _.trigger('change', id, input);
        _.delay(() => {
            input.value = 'b';
            _.trigger('change', id, input);
            _.delay(() => {
                expect(count).to.equal(2);
                done();
            }, 20);
        }, 20);
    });
    it('not fires on empty', (done) => {
        wordEvent   = new WordEvent({
            target: '#input', detailOrId: id, waitTime: 10, fireOnEmpty: false, fireOnRegex: true
        });
        input.value = ' ';
        _.trigger('change', id, input);
        _.on(Factory.eventName(WordEvent.name()), () => {done('come on!')}, id, input);
        _.delay(() => {done()}, 20);
    });
    it('fires on empty', (done) => {
        _.on(Factory.eventName(WordEvent.name()), () => {done()}, id, input);
        wordEvent   = new WordEvent({
            target: '#input', detailOrId: id, waitTime: 10, fireOnEmpty: true, fireOnRegex: true
        });
        input.value = ' ';
        _.trigger('change', id, input);
    });
    it('fires on regex', (done) => {
        _.on(Factory.eventName(WordEvent.name()), () => {
            expect(input.classList.contains(WordEvent.matchesRegex())).to.be.true;
            expect(input.classList.contains(WordEvent.mismatchesRegex())).to.be.false;
            done()
        }, id, input);
        wordEvent   =
            new WordEvent({
                target: '#input', detailOrId: id, waitTime: 10000, fireOnRegex: true,
                regex : /^[^\s]+\s$/
            });
        input.value = 'a ';
        _.trigger('change', id, input);
    });
    it('not fires on regex', (done) => {
        const errorFn = _.on(Factory.eventName(WordEvent.name()), () => {done('come on!')}, id,
                             input);
        wordEvent     =
            new WordEvent({
                target: '#input', detailOrId: id, waitTime: 10, fireOnRegex: false,
                regex : /^[^\s]+\s$/
            });
        input.value   = 'a ';
        _.trigger('change', id, input);
        _.delay(() => {
            _.off(Factory.eventName(WordEvent.name()), errorFn, input);
            _.on(Factory.eventName(WordEvent.name()), () => {done()}, id, input);
        }, 5);

    });
    it('regex enforced', (done) => {
        wordEvent   = new WordEvent({
            target: '#input', detailOrId: id, regex: /b/, enforceRegex: true, fireOnEnter: true
        });
        input.value = 'a';
        let event   = new KeyboardEvent('keyup', {key: 'Enter'});
        input.dispatchEvent(event);
        _.on(Factory.eventName(WordEvent.name()), () => {done('come on!')}, id, input);
        _.delay(() => {
            expect(input.classList.contains(WordEvent.mismatchesRegex())).to.be.true;
            expect(input.classList.contains(WordEvent.matchesRegex())).to.be.false;
            done()
        }, 20);
    });
    it('fires on enter', (done) => {
        _.on(Factory.eventName(WordEvent.name()), () => {done()}, id, input);
        wordEvent   =
            new WordEvent({target: '#input', detailOrId: id, waitTime: 10000, fireOnEnter: true});
        input.value = 'a';
        let event   = new KeyboardEvent('keyup', {key: 'Enter'});
        input.dispatchEvent(event);
    });
    it('enter sets class', (done) => {
        _.on(Factory.eventName(WordEvent.name()), () => {
            expect(input.classList.contains(WordEvent.matchesRegex())).to.be.true;
            expect(input.classList.contains(WordEvent.mismatchesRegex())).to.be.false;
            done()
        }, id, input);
        wordEvent   =
            new WordEvent({
                target: '#input', detailOrId: id, waitTime: 10000, fireOnEnter: true, regex: /b/
            });
        input.value = 'a';
        let event   = new KeyboardEvent('keyup', {key: 'Enter'});
        input.dispatchEvent(event);
    });
    it('not fires on enter', (done) => {
        const errorFn = _.on(Factory.eventName(WordEvent.name()), () => {done('come on!')}, id,
                             input);
        wordEvent     =
            new WordEvent({target: '#input', detailOrId: id, waitTime: 10, fireOnEnter: false});
        input.value   = 'a';
        let event     = new KeyboardEvent('keyup', {key: 'Enter'});
        input.dispatchEvent(event);
        _.trigger('change', id, input);
        _.delay(() => {
            _.off(Factory.eventName(WordEvent.name()), errorFn, input);
            _.on(Factory.eventName(WordEvent.name()), () => {done()}, id, input);
        }, 5);
    });
    afterEach(() => {
        if (wordEvent) wordEvent.stop();
        div.parentNode.removeChild(div);
    });
});