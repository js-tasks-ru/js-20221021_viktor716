/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  if (size === 0) {
    return '';
  }

  const arr = [...string];  
  let currentLength = 0;
  let resultString = '';
 
  arr.forEach((item, index, array) => {
    if(array[index] !== array[index-1]) {
      currentLength = 0;
    }

    if(currentLength < size) {
      resultString += item;
      currentLength++
    }
  });

  return resultString;
}
