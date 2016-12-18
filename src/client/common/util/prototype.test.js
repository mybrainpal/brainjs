/**
 * Proudly created by ohad on 18/12/2016.
 */
var expect    = require('chai').expect,
    Prototype = require('./prototype');

describe('Prototype', function () {
    it('isEmpty - empty types', function () {
        expect(Prototype.isEmpty({})).to.be.true;
        expect(Prototype.isEmpty([])).to.be.true;
        expect(Prototype.isEmpty(null)).to.be.true;
        expect(Prototype.isEmpty(undefined)).to.be.true;
        //noinspection JSPrimitiveTypeWrapperUsage
        expect(Prototype.isEmpty(new Object())).to.be.true;
        expect(Prototype.isEmpty('')).to.be.true;
        expect(Prototype.isEmpty(1)).to.be.true;
        expect(Prototype.isEmpty(0)).to.be.true;
        expect(Prototype.isEmpty({length: 0, items: []})).to.be.true;
        expect(Prototype.isEmpty(new EmptyClass())).to.be.true;
        expect(Prototype.isEmpty(new UselessClass())).to.be.true;
    });
    it('isEmpty - non empty types', function () {
        var myNamespace = {};
        myNamespace.foo = function () {};
        expect(Prototype.isEmpty({a: null})).to.be.false;
        expect(Prototype.isEmpty([1])).to.be.false;
        expect(Prototype.isEmpty('aa')).to.be.false;
        expect(Prototype.isEmpty(myNamespace)).to.be.false;
        expect(Prototype.isEmpty(new ContainerClass())).to.be.false;
    });
    it('get - successes', function () {
        var obj = {a: {b: {c: 1}}};
        expect(Prototype.get(obj, 'a')).to.deep.equal({b: {c: 1}});
        expect(Prototype.get(obj, ['a'])).to.deep.equal({b: {c: 1}});
        expect(Prototype.get(obj, ['a', 'b', 'c'])).to.equal(1);
    });
    it('get - failures', function () {
        var obj = {a: {b: {c: 1}}};
        expect(function () {//noinspection JSCheckFunctionSignatures
            Prototype.set(1, 'a', 1);
        }).to.throw(TypeError);
        expect(function () {//noinspection JSCheckFunctionSignatures
            Prototype.get(obj, {});
        }).to.throw(TypeError);
        expect(function () {//noinspection JSCheckFunctionSignatures
            Prototype.get(obj, 1);
        }).to.throw(TypeError);
        expect(function () {
            Prototype.get(obj, []);
        }).to.throw(RangeError);
        expect(function () {
            Prototype.get(obj, [1]);
        }).to.throw(TypeError);
        expect(Prototype.get(obj, ['b'])).to.not.be.ok;
        expect(Prototype.get(obj, ['a', 'b', 'd'])).to.not.be.ok;
    });
    it('set - successes', function () {
        expect(Prototype.set({}, 'a', {b: {c: 1}})).to.deep.equal({a: {b: {c: 1}}});
        expect(Prototype.set({}, ['a'], 1)).to.deep.equal({a: 1});
        expect(Prototype.set({}, ['a', 'b'], 2)).to.deep.equal({a: {b: 2}});
        expect(Prototype.set({a: {b: 1}}, ['a', 'b'], 2)).to.deep.equal({a: {b: 2}});
        expect(Prototype.set({a: {b: 1}}, ['a', 'b', 'c'], 2)).to.deep.equal({a: {b: {c: 2}}});
        expect(Prototype.set({a: {aa: 1}}, ['a', 'b'], 2)).to.deep.equal({a: {aa: 1, b: 2}});
        expect(Prototype.set({a: {aa: 1}}, ['a', 'b', 'c'], 2)).to.deep
                                                               .equal({a: {aa: 1, b: {c: 2}}});
    });
    it('set - failures', function () {
        expect(function () {//noinspection JSCheckFunctionSignatures
            Prototype.set(1, 'a', 1);
        }).to.throw(TypeError);
        expect(function () {//noinspection JSCheckFunctionSignatures
            Prototype.set({}, {}, 1);
        }).to.throw(TypeError);
        expect(function () {//noinspection JSCheckFunctionSignatures
            Prototype.set({}, 1, 1);
        }).to.throw(TypeError);
        expect(function () {
            Prototype.set({}, [], 1);
        }).to.throw(RangeError);
        expect(function () {
            Prototype.set({}, [1], 1);
        }).to.throw(TypeError);
    });
    //noinspection FunctionNamingConventionJS
    function EmptyClass() {}

    //noinspection FunctionNamingConventionJS
    function UselessClass() {}

    //noinspection JSUnusedGlobalSymbols
    UselessClass.prototype.foo = function () {};
    //noinspection FunctionNamingConventionJS
    function ContainerClass() {
        //noinspection JSUnusedGlobalSymbols
        this.foo = 'a';
    }
});
