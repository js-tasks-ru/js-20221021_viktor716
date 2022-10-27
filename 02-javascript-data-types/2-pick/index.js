/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let newObjectToReturn = {};
  
  for(let key of fields) {
    if(key in obj) {
      newObjectToReturn[key] = obj[key];
    }
  }

  return newObjectToReturn;
};
