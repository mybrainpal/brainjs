/**
 * Proudly created by ohad on 12/12/2016.
 */
var expect = require('chai').expect,
    before = require('mocha').before,
    beforeEach = require('mocha').beforeEach,
    describe = require('mocha').describe,
    it = require('mocha').it,
    Locator = require('./locator');

describe('Locator', function () {
    var description, parentDiv, a1, a2, span, itDescription, img;
    before(function () {
        parentDiv = document.createElement('div');
        parentDiv.setAttribute('id', 'id-parent');
        parentDiv.setAttribute('class', 'class-parent');
        document.getElementsByTagName("body")[0].appendChild(parentDiv);
        a1 = document.createElement('a');
        a1.setAttribute('id', 'a1');
        a1.setAttribute('class', 'class1 class2');
        a1.setAttribute('att1', 'foo');
        a1.setAttribute('att2', 'bar');
        a1.setAttribute('href', 'http://brainpal.io#winter-is-coming');
        a1.textContent = 'buy now!!';
        a2 = a1.cloneNode(true);
        a2.setAttribute('id', 'a2');
        a2.setAttribute('att2', '');
        span = document.createElement('span');
        span.setAttribute('class', 'class1 class2');
        span.setAttribute('att1', 'foo');
        span.setAttribute('att2', 'bar');
        span.textContent = 'thanks';
        parentDiv.appendChild(span);
        parentDiv.appendChild(a1);
        parentDiv.appendChild(a2);
    });
    beforeEach(function () {
        description = {
            id: 'a1',
            classes: [
                'class1',
                'class2'
            ],
            parent: {
                id: 'id-parent',
                classes: [
                    'class-parent'
                ],
                tag: 'div'
            },
            tag: 'a',
            attributes: {
                att1: 'foo',
                att2: 'bar',
                href: 'http://brainpal.io'
            },
            textContent: 'buy now',
            childNodeIndex: 1
        };
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
                id: 'a1'
            }
        };
        img = document.createElement('img');
        a1.appendChild(img);
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
            textContent: 'thanks'
        };
        expect(Locator.locate(itDescription)).to.equal(span);
    });
    it('Locate by child node index', function () {
        itDescription = {
            parent: {
                tag: 'div'
            },
            childNodeIndex: 2
        };
        expect(Locator.locate(itDescription)).to.equal(a1);
    });
});
