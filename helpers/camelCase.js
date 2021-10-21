function camelCaseKeys(obj) {
  var newObj = {};
  for (d in obj) {
    if (obj.hasOwnProperty(d)) {
      newObj[
        d.replace(/(\_\w)/g, function (k) {
          return k[1].toUpperCase();
        })
      ] = obj[d];
    }
  }
  return newObj;
}

module.exports = camelCaseKeys;
