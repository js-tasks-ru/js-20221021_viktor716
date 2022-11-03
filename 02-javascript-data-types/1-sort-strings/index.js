/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
 export function sortStrings(arr, param = 'asc') {
  // const sortedArr = arr.slice();
  const sortedArr = [...arr];   // лучший вариант скопировать массив
  const sortCollator = new Intl.Collator('ru', { caseFirst: 'upper' } );
  const sortDirection = (param === 'asc') ? 1 : (param === 'desc') ? -1 : null;
  
  return sortedArr.sort( (a, b) => sortCollator.compare(a, b)*sortDirection);
}
