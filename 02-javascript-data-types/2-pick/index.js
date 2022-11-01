/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const newObjectToReturn = {};
  
  // вариант решения с занятия
  /*for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      newObjectToReturn[key] = value;
    }
  }*/

  for (const key of fields) {
    if (obj.hasOwnProperty(key)) {
      newObjectToReturn[key] = obj[key];
    }
  }

  return newObjectToReturn;
};
