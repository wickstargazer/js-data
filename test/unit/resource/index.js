/* global JSData:true, Resource:true, configure:true */
import {assert} from 'chai'
import * as createInstance from './createInstance.test'
import * as eject from './eject.test'
import * as ejectAll from './ejectAll.test'
import * as get from './get.test'
import * as getAll from './getAll.test'
import * as inject from './inject.test'

let isBrowser = false

try {
  isBrowser = !!window
} catch (e) {
}

const defaults = {
  autoInject: isBrowser,
  bypassCache: false,
  csp: false,
  defaultAdapter: 'http',
  eagerEject: false,
  idAttribute: 'id',
  linkRelations: isBrowser,
  onConflict: 'merge',
  relationsEnumerable: false,
  returnMeta: false,
  strategy: 'single',
  useFilter: true
}

export function init () {
  describe('Resource', function () {
    it('should be a constructor function', function () {
      assert.isFunction(Resource, 'should be a function')
      let instance = new Resource()
      assert.isTrue(instance instanceof Resource, 'instance should be an instance')
      instance = new Resource({ foo: 'bar' })
      assert.deepEqual(instance, { foo: 'bar' }, 'instance should get initialization properties')
    })
    it('should have the correct static defaults', function () {
      for (var key in defaults) {
        assert.equal(Resource[key], defaults[key], key + ' should be ' + defaults[key])
      }
    })
    it('child should inherit static defaults', function () {
      var key
      let User = Resource.extend({}, {
        name: 'user'
      })
      for (key in defaults) {
        assert.equal(User[key], defaults[key], key + ' should be ' + defaults[key])
      }
      class User2 extends Resource {}
      for (key in defaults) {
        assert.equal(User2[key], defaults[key], key + ' should be ' + defaults[key])
      }
    })
    it('child should override static defaults', function () {
      const store = new JSData.DS()

      /**
       * ES5 ways of creating a new Resource
       */
      let User = Resource.extend({}, {
        idAttribute: '_id',
        name: 'user'
      })

      // Not yet implemented in v3
      let User2 = store.defineResource({
        idAttribute: '_id',
        name: 'user'
      })

      /**
       * ES6 ways of creating a new Resource
       */
      class User3 extends Resource {}
      configure({
        idAttribute: '_id'
      })(User3)

      class User4 extends Resource {}
      User4.configure({
        idAttribute: '_id'
      })

     /**
       * ES7 way of creating a new Resource
       */
      // Doesn't work right now because of https://github.com/babel/babel/issues/2645
      // @configure({
      //   idAttribute: '_id'
      // })
      // class User5 extends Resource {}

      check(User)
      // check(User2)
      check(User3)
      check(User4)
      // check(User5)

      function check (Class) {
        for (var key in defaults) {
          if (key === 'idAttribute') {
            assert.equal(Class.idAttribute, '_id', 'should be "_id"')
          } else {
            assert.equal(Class[key], defaults[key], key + ' should be ' + defaults[key])
          }
        }
      }
    })
    it('should allow schema definition with basic indexes', function () {
      class User extends Resource {}
      User.schema({
        id: {},
        age: { indexed: true },
        role: { indexed: true }
      })
      User.inject([
        { id: 2, age: 18, role: 'admin' },
        { id: 3, age: 19, role: 'dev' },
        { id: 9, age: 19, role: 'admin' },
        { id: 6, age: 19, role: 'owner' },
        { id: 4, age: 22, role: 'dev' },
        { id: 1, age: 23, role: 'owner' }
      ])
      assert.deepEqual(
        User.getAll(19, { index: 'age' }),
        [
          { id: 3, age: 19, role: 'dev' },
          { id: 6, age: 19, role: 'owner' },
          { id: 9, age: 19, role: 'admin' }
        ],
        'should have found all of age:19 using 1 keyList'
      )
    })

    createInstance.init()
    eject.init()
    ejectAll.init()
    get.init()
    getAll.init()
    inject.init()
  })
}