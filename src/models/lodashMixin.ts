/* eslint-disable prefer-rest-params */
import _ from 'lodash'

interface LodashMixin extends _.LoDashStatic {
    memoizedThrottle(fn: Function, delay: number): Function
}

// This is a bit hackish (It's not proper Typescript!), but the purpose is to throttle a function separately for different arguments.
// This is used to throttle sending directory updates on every file change if a lot of files are being changed rapidly
// Each throttle should be independent per directory being changed
_.mixin({
  memoizedThrottle: function (func, wait = 0, options = {}) {
    const mem = _.memoize(function () {
      return _.throttle(func, wait, options)
    }, options.resolver)
    // @ts-ignore
    return function () { mem.apply(this, arguments).apply(this, arguments) }
  }
})

export default <LodashMixin>_
