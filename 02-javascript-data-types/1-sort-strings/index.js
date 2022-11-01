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

  sortedArr.sort( (a, b) => 
                  (param === 'asc') ? sortCollator.compare(a, b) :
                  (param === 'desc') ? sortCollator.compare(b, a) :
                  null
                );

  return sortedArr;
}
