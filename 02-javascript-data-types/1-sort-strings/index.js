/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let sortedArr = arr.slice();

  if(param == 'desc') {
    return sortedArr.sort(new Intl.Collator('ru', { caseFirst: 'upper' } ).compare).reverse();
  }

  return sortedArr.sort(new Intl.Collator('ru', { caseFirst: 'upper' } ).compare);
}
