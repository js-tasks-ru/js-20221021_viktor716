/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (!obj) {
    return;
  }

  const objectToReturn = {};
  const map = new Map(Object.entries(obj));

  for (const [key, value] of map) {
    objectToReturn[value] = key;
  }

  return objectToReturn;
}
