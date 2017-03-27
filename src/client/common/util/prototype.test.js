/**
 * Proudly created by ohad on 10/01/2017.
 */
let expect = require('chai').expect,
    _      = require('./prototype');

describe('Prototype', () => {
  describe('isEmpty', () => {
    //noinspection FunctionNamingConventionJS
    function EmptyClass() {}

    //noinspection FunctionNamingConventionJS
    function UselessClass() {}

    //noinspection JSUnusedGlobalSymbols
    UselessClass.prototype.foo = () => {};
    //noinspection FunctionNamingConventionJS
    function ContainerClass() {
      //noinspection JSUnusedGlobalSymbols
      this.foo = 'a';
    }

    it('isEmpty - empty types', () => {
      expect(_.isEmpty({})).to.be.true;
      expect(_.isEmpty([])).to.be.true;
      expect(_.isEmpty(null)).to.be.true;
      expect(_.isEmpty(undefined)).to.be.true;
      //noinspection JSPrimitiveTypeWrapperUsage
      expect(_.isEmpty(new Object())).to.be.true;
      expect(_.isEmpty('')).to.be.true;
      expect(_.isEmpty(1)).to.be.true;
      expect(_.isEmpty(0)).to.be.true;
      expect(_.isEmpty({length: 0, items: []})).to.be.true;
      expect(_.isEmpty(new EmptyClass())).to.be.true;
      expect(_.isEmpty(new UselessClass())).to.be.true;
    });
    it('isEmpty - non empty types', () => {
      let myNamespace = {};
      myNamespace.foo = () => {};
      expect(_.isEmpty({a: null})).to.be.false;
      expect(_.isEmpty([1])).to.be.false;
      expect(_.isEmpty('aa')).to.be.false;
      expect(_.isEmpty(myNamespace)).to.be.false;
      expect(_.isEmpty(new ContainerClass())).to.be.false;
    });
  });
  describe('is', () => {
    it('is type', () => {
      function A() {}

      function B() {}

      function C() {}

      expect(_.is(1, Object)).to.be.false;
      expect(_.is({}, A)).to.be.false;
      expect(_.is(new C(), A, B)).to.be.false;

      expect(_.is({}, Object)).to.be.true;
      expect(_.is(new A(), Object)).to.be.true;
      expect(_.is(new A(), A)).to.be.true;
      expect(_.is(new A(), B, A)).to.be.true;
    });
  });
  describe('base', () => {
    it('isString', () => {
      expect(_.isString('')).to.be.true;
      expect(_.isString({}.toString())).to.be.true;
      //noinspection JSCheckFunctionSignatures
      expect(_.isString(1)).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isString(null)).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isString()).to.be.false;
    });
    it('isNumber', () => {
      expect(_.isNumber(1)).to.be.true;
      //noinspection JSCheckFunctionSignatures
      expect(_.isNumber('')).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isNumber(null)).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isNumber()).to.be.false;
    });
    it('isBoolean', () => {
      expect(_.isBoolean(true)).to.be.true;
      expect(_.isBoolean(false)).to.be.true;
      //noinspection JSCheckFunctionSignatures
      expect(_.isBoolean('')).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isBoolean(null)).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isBoolean()).to.be.false;
    });
    it('isObject', () => {
      expect(_.isObject({})).to.be.true;
      expect(_.isObject(() => {})).to.be.false;
      expect(_.isObject(1)).to.be.false;
      expect(_.isObject(null)).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isObject()).to.be.false;
    });
    it('isFunction', () => {
      expect(_.isFunction(() => {})).to.be.true;
      //noinspection JSCheckFunctionSignatures
      expect(_.isFunction({})).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isFunction(1)).to.be.false;
      expect(_.isFunction(null)).to.be.false;
      //noinspection JSCheckFunctionSignatures
      expect(_.isFunction()).to.be.false;
    });
    it('get - successes', () => {
      let obj = {a: {b: {c: 1}}};
      expect(_.get(obj, 'a')).to.deep.equal({b: {c: 1}});
      expect(_.get(obj, ['a'])).to.deep.equal({b: {c: 1}});
      expect(_.get(obj, ['a', 'b', 'c'])).to.equal(1);
    });
    it('get - failures', () => {
      let obj = {a: {b: {c: 1}}};
      expect(() => {//noinspection JSCheckFunctionSignatures
        _.set(1, 'a', 1);
      }).to.throw(Error);
      expect(() => {//noinspection JSCheckFunctionSignatures
        _.get(obj, {});
      }).to.throw(Error);
      expect(() => {//noinspection JSCheckFunctionSignatures
        _.get(obj, 1);
      }).to.throw(Error);
      expect(() => {
        _.get(obj, []);
      }).to.throw(Error);
      expect(() => {
        _.get(obj, [1]);
      }).to.throw(Error);
      //noinspection BadExpressionStatementJS
      expect(_.get(obj, ['b'])).to.not.be.ok;
      //noinspection BadExpressionStatementJS
      expect(_.get(obj, ['a', 'b', 'd'])).to.not.be.ok;
    });
    it('set - successes', () => {
      expect(_.set({}, 'a', {b: {c: 1}})).to.deep.equal({a: {b: {c: 1}}});
      expect(_.set({}, ['a'], 1)).to.deep.equal({a: 1});
      expect(_.set({}, ['a', 'b'], 2)).to.deep.equal({a: {b: 2}});
      expect(_.set({a: {b: 1}}, ['a', 'b'], 2)).to.deep.equal({a: {b: 2}});
      expect(_.set({a: {b: 1}}, ['a', 'b', 'c'], 2)).to.deep.equal({a: {b: {c: 2}}});
      expect(_.set({a: {aa: 1}}, ['a', 'b'], 2)).to.deep.equal({a: {aa: 1, b: 2}});
      expect(_.set({a: {aa: 1}}, ['a', 'b', 'c'], 2)).to.deep
                                                     .equal({a: {aa: 1, b: {c: 2}}});
    });
    it('set - failures', () => {
      expect(() => {//noinspection JSCheckFunctionSignatures
        _.set(1, 'a', 1);
      }).to.throw(Error);
      expect(() => {//noinspection JSCheckFunctionSignatures
        _.set({}, {}, 1);
      }).to.throw(Error);
      expect(() => {//noinspection JSCheckFunctionSignatures
        _.set({}, 1, 1);
      }).to.throw(Error);
      expect(() => {
        _.set({}, [], 1);
      }).to.throw(Error);
      expect(() => {
        _.set({}, [1], 1);
      }).to.throw(Error);
    });
  });
  describe('deep-extend', () => {

    it('can extend on 1 level', () => {
      let a = {hello: 1};
      let b = {world: 2};
      _.extend(a, b);
      expect(a).to.deep.equal({
                                hello: 1,
                                world: 2
                              });
    });

    it('can extend on 2 levels', () => {
      let a = {person: {name: 'John'}};
      let b = {person: {age: 30}};
      _.extend(a, b);
      expect(a).to.deep.equal({
                                person: {name: 'John', age: 30}
                              });
    });

    it('Date objects', () => {
      let a = {d: new Date()};
      let b = _.extend({}, a);
      expect(b.d).to.be.instanceOf(Date);
    });

    it('Date object is cloned', () => {
      let a = {d: new Date()};
      let b = _.extend({}, a);
      b.d.setTime((new Date()).getTime() + 100000);
      expect(b.d.getTime()).to.not.deep.equal(a.d.getTime());
    });

    it('RegExp objects', () => {
      let a = {d: new RegExp()};
      let b = _.extend({}, a);
      expect(b.d).to.be.instanceOf(RegExp);
    });

    it('RegExp object is cloned', () => {
      let a = {d: new RegExp('b', 'g')};
      let b = _.extend({}, a);
      b.d.test('abc');
      expect(b.d.lastIndex).to.not.deep.equal(a.d.lastIndex);
    });

    it('doesn\'t change sources', () => {
      let a = {a: [1]};
      let b = {a: [2]};
      let c = {c: 3};
      _.extend({}, a, b, c);
      expect(a).to.deep.equal({a: [1]});
      expect(b).to.deep.equal({a: [2]});
      expect(c).to.deep.equal({c: 3});
    });

    it('example from README.md', () => {
      let obj1 = {
        a: 1,
        b: 2,
        d: {
          a: 1,
          b: [],
          c: {test1: 123, test2: 321}
        },
        f: 5,
        g: 123,
        i: 321,
        j: [1, 2]
      };
      let obj2 = {
        b: 3,
        c: 5,
        d: {
          b: {first: 'one', second: 'two'},
          c: {test2: 222}
        },
        e: {one: 1, two: 2},
        f: [],
        g: (void 0),
        h: /abc/g,
        i: null,
        j: [3, 4]
      };

      _.extend(obj1, obj2);
      expect(obj1).to.deep.equal({
                                   a: 1,
                                   b: 3,
                                   d: {
                                     a: 1,
                                     b: {first: 'one', second: 'two'},
                                     c: {test1: 123, test2: 222}
                                   },
                                   f: [],
                                   g: undefined,
                                   c: 5,
                                   e: {one: 1, two: 2},
                                   h: /abc/g,
                                   i: null,
                                   j: [3, 4]
                                 });
      expect(('g' in obj1)).to.deep.equal(true);
      expect(('x' in obj1)).to.deep.equal(false);
    });

    it('clone arrays instead of extend', () => {
      expect(_.extend({a: [1, 2, 3]}, {a: [2, 3]})).to.deep.equal({a: [2, 3]});
    });

    it('checking keys for hasOwnPrototype', () => {
      let A         = function () {
        this.x = 1;
        this.y = 2;
      };
      A.prototype.z = 3;
      let foo       = new A();
      expect(_.extend({x: 123}, foo)).to.deep.equal({
                                                          x: 1,
                                                          y: 2
                                                        });
      foo.z = 5;
      expect(_.extend({x: 123}, foo, {y: 22})).to.deep.equal({
                                                                   x: 1,
                                                                   y: 22,
                                                                   z: 5
                                                                 });
    });

    it('clone functions', () => {
      let called = false;
      let obj    = {fn: () => {called = true}};
      let target = _.extend({}, obj);
      target.fn();
      expect(called).to.be.true;
    });

  });
  describe('arrify', () => {
    it('base cases', () => {
      expect(_.arrify([])).to.deep.equal([]);
      //noinspection JSCheckFunctionSignatures
      expect(_.arrify()).to.deep.equal([]);
      expect(_.arrify(null)).to.deep.equal([]);
      expect(_.arrify({})).to.deep.equal([{}]);
      expect(_.arrify(1)).to.deep.equal([1]);
      expect(_.arrify([1])).to.deep.equal([1]);
      expect(_.arrify([[1], 2])).to.deep.equal([[1], 2]);
    })
  });
  describe('timeout & interval', function () {
    this.timeout(100);
    it('delay works', (done) => {
      _.delay(() => {done()});
    });
    it('delay preserves this context ', (done) => {
      const a = [1];
      a.fn    = function () {
        if (this[0] === 1) {
          done();
        } else {
          done('this is shit!');
        }
      };
      _.delay.call(a, a.fn);
    });
    it('interval works', (done) => {
      let count = 0;
      _.interval(() => {count++}, 5);
      setTimeout(() => {
        expect(count).to.be.at.least(2);
        done();
      }, 20);
    });
    it('interval preserves this context ', (done) => {
      let count = 0;
      const a   = [1];
      a.fn      = function () {
        if (this[0] === 1) {
          count++;
        } else {
          done('this is shit!');
        }
      };
      _.interval.call(a, () => {a.fn()}, 5);
      setTimeout(() => {
        expect(count).to.be.at.least(2);
        done();
      }, 20);
    });
  });
});