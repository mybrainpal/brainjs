/**
 * Proudly created by ohad on 12/12/2016.
 */
var chai    = require('chai'),
    expect  = require('chai').expect,
    rewire  = require('rewire'),
    Locator = rewire('./locator');

chai.use(require('chai-spies'));

describe('Locator', function () {
    var description,
        parentDiv, a1, a2, img, span,
        itDescription,
        loggerSpy,
        loggerMock;
    before(function () {
        description = {
            id            : 'a1',
            classes       : [
                'class1',
                'class2'
            ],
            parent        : {
                id     : 'id-parent',
                classes: [
                    'class-parent'
                ],
                tag    : 'div'
            },
            tag           : 'a',
            attributes    : {
                att1: 'foo',
                att2: 'bar',
                href: 'http://brainpal.io'
            },
            textContent   : '^buy now',
            childNodeIndex: 1
        };
        parentDiv   = document.createElement('div');
        parentDiv.setAttribute('id', 'id-parent');
        parentDiv.setAttribute('class', 'class-parent');
        document.getElementsByTagName("body")[0].appendChild(parentDiv);
        a1 = document.createElement('a');
        a1.setAttribute('id', description.id);
        a1.setAttribute('class', description.classes[0] + ' ' + description.classes[1]);
        a1.setAttribute('att1', description.attributes.att1);
        a1.setAttribute('att2', description.attributes.att2);
        a1.setAttribute('href', description.attributes.href + '#winter-is-coming');
        a1.textContent = 'buy now!!';
        a2  = a1.cloneNode(true);
        a2.setAttribute('id', 'a2');
        a2.setAttribute('att2', '');
        span = document.createElement('span');
        span.setAttribute('class', a1.getAttribute('class'));
        span.setAttribute('att1', description.attributes.att1);
        span.setAttribute('att2', description.attributes.att2);
        span.textContent = 'thanks';
        img = document.createElement('img');
        a2.appendChild(img);
        parentDiv.appendChild(span);
        parentDiv.appendChild(a1);
        parentDiv.appendChild(a2);
        loggerMock = {
            'log': _logMockFn
        };
        Locator.__set__({
                            'Logger': loggerMock
                        });
        loggerSpy = chai.spy.on(loggerMock, 'log');
    });
    beforeEach(function () {
        loggerSpy.reset();
    });
    it('no description returns nada', function () {
        expect(Locator.locate({})).to.not.be.ok;
        expect(loggerSpy).to.have.been.called.once;
    });
    it('don\'t log', function () {
        expect(Locator.locate({}, {logFailure: false})).to.not.be.ok;
        expect(loggerSpy).to.not.have.been.called.once;
    });
    it('Locate by ID', function () {
        itDescription = {
            id: description.id
        };
        expect(Locator.locate(itDescription)).to.equal(a1);
    });
    it('Locate by tag', function () {
        itDescription = {
            tag: 'span'
        };
        expect(Locator.locate(itDescription)).to.equal(span);
    });
    it('Locate by parent', function () {
        itDescription = {
            parent: {
                id: 'a2'
            }
        };
        expect(Locator.locate(itDescription)).to.equal(img);
    });
    it('Locate by attributes', function () {
        itDescription = {
            attributes: description.attributes
        };
        expect(Locator.locate(itDescription)).to.equal(a1);
    });
    it('Locate by text content', function () {
        itDescription = {
            textContent: '^thanks$'
        };
        expect(Locator.locate(itDescription)).to.equal(span);
    });
    it('Locate by child node index', function () {
        itDescription = {
            parent        : {
                tag: 'div'
            },
            childNodeIndex: 1
        };
        expect(Locator.locate(itDescription)).to.equal(a1);
    });
    it('Single match true', function () {
        itDescription = {
            textContent: description.textContent
        };
        expect(Locator.locate(itDescription, {singleMatch: true})).to.not.be.ok;
        expect(loggerSpy).to.have.been.called.once;
    });
    it('Single match false', function () {
        itDescription = {
            textContent: description.textContent
        };
        expect(Locator.locate(itDescription, {singleMatch: false})).to.equal(a1);
    });
    it('Could not find parent', function () {
        itDescription = {
            parent: {
                id: 'slim-shady'
            }
        };
        expect(Locator.locate(itDescription)).to.not.be.ok;
        expect(loggerSpy).to.have.been.called.once;
    });
    it('Could not find parent, find by attributes', function () {
        itDescription = {
            parent    : {
                id: 'slim-shady'
            },
            attributes: description.attributes
        };
        expect(Locator.locate(itDescription)).to.equal(a1);
        expect(loggerSpy).to.not.have.been.called();
    });
    after(function () {
        parentDiv.parentNode.removeChild(parentDiv);
    });
});

function _logMockFn() {
    // console.log('failed to locate ' + JSON.stringify(arguments[1]))
}
