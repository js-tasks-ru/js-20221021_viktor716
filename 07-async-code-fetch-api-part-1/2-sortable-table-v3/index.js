import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  subElements = {};
  element;
  countToLoad = 30;
  start = 1;
  end = this.start + this.countToLoad;
  isLoading = false;
  data = [];

  constructor(headerConfig = [], {
    url = '',
    sorted = {
      id: headerConfig.find((item) => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
    countToLoad = 30,
    start = 1,
    end = start + countToLoad
  } = {}) {
    this.headerConfig = headerConfig;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.url = new URL(url, BACKEND_URL);
    this.countToLoad = countToLoad;
    this.start = start;
    this.end = end;

    this.render();
  }

  getTemplate() {
    return `
    <div class="sortable-table">
      ${this.getHeader()}
      ${this.getBody(this.data)}
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        No products
      </div>
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

  getHeaderCell(item) {
    const order = this.sorted.id === item.id ? this.sorted.order : 'asc';

    return `
    <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
      <span>${item.title}</span>
      ${this.getSortArrow(item.id)}
    </div>
    `;
  }

  getSortArrow(id) {
    return (this.sorted.id === id) ? 
                `<span data-element="arrow" class="sortable-table__sort-arrow">
                  <span class="sort-arrow"></span>
                </span>`
                : '';
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
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getBodyRow(item, data)}
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
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
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

  async render() {
    const newElement = document.createElement("div");

    newElement.innerHTML = this.getTemplate();

    this.element = newElement.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    const data = await this.dataLoad(this.sorted.id, this.sorted.order, this.start, this.end);

    this.tableRowsAdd(data);

    this.subElements.header.addEventListener('pointerdown', this.sortOnColumnClick);
    window.addEventListener('scroll', this.onScrollTable);
  }

  async dataLoad(id, order, start = this.start, end = this.end) {
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');
    const dataFromServer = await fetchJson(this.url);
    this.element.classList.remove('sortable-table_loading');

    return dataFromServer;
  }

  tableRowsAdd(data) {
    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
      this.data = data;
      this.subElements.body.innerHTML = this.getAllBodyRows(data);
    } else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  sortOnColumnClick = (event) => {
    const column = event.target.closest('[data-sortable="true"]');

    if (column) {
      const newOrderValue = (column.dataset.order === 'asc') ? 'desc' : 'asc';

      this.sorted = {
        id: column.dataset.id,
        order: newOrderValue
      };

      column.dataset.order = newOrderValue;
      column.append(this.subElements.arrow);

      if (this.isSortLocally) {
        return this.sortOnClient(this.sorted.id, newOrderValue);
      } else {
        return this.sortOnServer(this.sorted.id, newOrderValue);
      }
    }
  };

  async sortOnServer(id, order) {
    const start = 1;
    const end = start + this.countToLoad;
    const data = await this.dataLoad(id, order, start, end);

    this.tableRowsAdd(data);
  }
  
  sortOnClient(id, order) {    
    const sortedData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getAllBodyRows(sortedData);
  }

  sortData(fieldValue, orderValue) {
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

  onScrollTable = async () => {
    const bottom = this.element.getBoundingClientRect().bottom;

    if (bottom < document.documentElement.clientHeight && !this.isLoading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.countToLoad;

      this.isLoading = true;
      const data = await this.dataLoad(this.sorted.id, this.sorted.order, this.start, this.end);

      this.update(data);
      this.isLoading = false;
    }
  };

  update(data) {
    const newRowSet = document.createElement('div');

    this.data.concat(data);
    newRowSet.innerHTML = this.getAllBodyRows(data);

    this.subElements.body.append(...newRowSet.childNodes);
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

    document.removeEventListener('scroll', this.onScrollTable);
  }
}
