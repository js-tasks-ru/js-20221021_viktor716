export default class SortableTable {
  subElements = {};
  element;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getTemplate() {
    return `
    <div class="sortable-table">
      ${this.getHeader()}
      ${this.getBody()}
    </div>
    `;
  }

  getHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getAllHeaderCells()}
    </div>
    `;
  }

  getAllHeaderCells() {
    return this.headerConfig.map((item) => this.getHeaderCell(item)).join('');
  }

  getHeaderCell(item){
    return `
    <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
      <span>${item.title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    </div>
    `;
  }

  getBody() {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.getAllBodyRows(this.data)}
    </div>
    `;
  }

  getAllBodyRows(data = []) {
    return data.map((item) => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getBodyRow(item)}
      </a>
      `;
    }).join('');
  }

  getBodyRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      if (template) {
        return template(item[id]);
      } else {
        return `<div class="sortable-table__cell">${item[id]}</div>`;
      }
    }).join('');
  }

  render() {
    const newElement = document.createElement("div");

    newElement.innerHTML = this.getTemplate();

    const tableElement = newElement.firstElementChild;

    this.element = tableElement;

    this.subElements = this.getSubElements(tableElement);
  }

  getSubElements(tableElement) {
    const subElements = {};
    const dataElements = tableElement.querySelectorAll('[data-element]');

    for (const subElement of dataElements) {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    }

    return subElements;
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  sort(fieldValue, orderValue) {    
    const tableColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const sortingColumn = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);
    const newSortedData = this.dataSort(fieldValue, orderValue);

    tableColumns.forEach((column) => {
      column.dataset.order = '';
    });
    sortingColumn.dataset.order = orderValue;

    this.subElements.body.innerHTML = this.getAllBodyRows(newSortedData);
  }

  dataSort(fieldValue, orderValue) {
    const arr = [...this.data];
    const sortingColumn = this.headerConfig.find((item) => item.id === fieldValue);
    const { sortType } = sortingColumn;
    
    const sortCollator = new Intl.Collator('ru', { caseFirst: 'upper' } );
    const sortDirection = (orderValue === 'asc') ? 1 : (orderValue === 'desc') ? -1 : null;

    return arr.sort((a, b) => {
      if (sortType === 'number') {
        return (a[fieldValue] - b[fieldValue]) * sortDirection;
      } else
      if (sortType === 'string') {
        return sortCollator.compare(a[fieldValue], b[fieldValue]) * sortDirection;
      } else {
        throw new Error(`Sorting type ${sortType} is not supported`);
      }
    });
  }
}