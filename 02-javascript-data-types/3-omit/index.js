/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const newObjectToReturn = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!fields.includes(key)) {
      newObjectToReturn[key] = value;
    }
  }

  return newObjectToReturn;
};
