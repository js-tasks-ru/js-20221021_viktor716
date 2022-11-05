/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const separatedPath = path.split('.');

  return (obj) => {
    let resultValue = obj;
    
    for (const pathPart of separatedPath) {
      if (resultValue === undefined) {
        break
      };

      resultValue = resultValue[pathPart];
    }
 
    return resultValue;
  }
}
