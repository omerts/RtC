const createMapToObjFunc (...args) => {
  return () => {
    return args.reduce((obj, key, i) => {
      obj[key] = arguments[i]
    }, {})
  }
}

export default createMapToObjFunc