export default class SortableTable {
  subElements = {};
  element;
  
  constructor(headerConfig = [], {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}, isSortLocally = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  getTemplate(data) {
    return `
    <div class="sortable-table">
      ${this.getHeader()}
      ${this.getBody(data)}
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
    const order = this.sorted.id === item.id ? this.sorted.order : 'asc';

    return `
    <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
      <span>${item.title}</span>
      ${this.getSortArrow(item.id)}
    </div>
    `;
  }

  getSortArrow(id) {
    if (this.sorted.id === id) {
      return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>`;
    } else {
      return '';
    }    
  }

  getBody(data) {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.getAllBodyRows(data)}
    </div>
    `;
  }

  getAllBodyRows(data) {
    return data.map((item) => {
      return `
      <div class="sortable-table__row">
        ${this.getBodyRow(item)}
      </div>
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
    const {id, order} = this.sorted;
    const newElement = document.createElement("div");
    const sortedData = this.sort(id, order);

    newElement.innerHTML = this.getTemplate(sortedData);

    this.element = newElement.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.subElements.header.addEventListener('pointerdown', this.sortOnColumnClick);
  }

  sort(fieldValue, orderValue) {
    if (this.isSortLocally) {
      return this.sortOnClient(fieldValue, orderValue);
    } else {
      return this.sortOnServer(fieldValue, orderValue);
    }
  }

  // empty method for future server-side sort
  sortOnServer() {
    return;
  }

  sortOnClient(fieldValue, orderValue) {
    const arr = [...this.data];
    const sortingColumn = this.headerConfig.find((item) => item.id === fieldValue);
    const { sortType, customSorting } = sortingColumn;
    
    const sortCollator = new Intl.Collator('ru', { caseFirst: 'upper' } );
    const sortDirection = (orderValue === 'asc') ? 1 : (orderValue === 'desc') ? -1 : null;

    return arr.sort((a, b) => {
      if (sortType === 'number') {
        return (a[fieldValue] - b[fieldValue]) * sortDirection;
      } else
      if (sortType === 'string') {
        return sortCollator.compare(a[fieldValue], b[fieldValue]) * sortDirection;
      } else
      if (sortType === 'custom') {
        return customSorting(a, b) * sortDirection;
      } else {
        throw new Error(`Sorting type ${sortType} is not supported`);
      }
    });
  }

  sortOnColumnClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    if (column) {
      const newOrderValue = (column.dataset.order === 'asc') ? 'desc' : 'asc';
      const sortedData = this.sort(column.dataset.id, newOrderValue);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrderValue;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getAllBodyRows(sortedData);
    }
  };

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
}
