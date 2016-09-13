// Babel is giving trouble with the arguments closure
export default function createMapToObjFunc (...args) {
  return function () {
    return args.reduce((obj, key, i) => {
      obj[key] = arguments[i]

      return obj
    }, {})
  }
}
