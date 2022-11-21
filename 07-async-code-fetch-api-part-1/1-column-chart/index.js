import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  element;
  data = [];

  constructor ( {
    data = [],
    url = "",
    label = "",
    value = 0,
    link = "",
    range = {},
    formatHeading = data => data
  } = {}) {
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;
    this.url = url;
    this.from = range.from;
    this.to = range.to;

    this.render();
  }

  getTemplate() {
    return `
    <div class="column-chart column-chart_loading">
    <div class="column-chart__title">
      Total ${this.label}
      ${this.getLink()}
    </div>
    <div class="column-chart__container">
      <div data-element="header" class="column-chart__header" style="--chart-height: 50">${this.value}</div>
      <div data-element="body" class="column-chart__chart">
        ${this.getChartColumns()}
      </div>
    </div>
  </div>
    `;
  }

  getChartColumns() {
    const dataValues = this.data.map(item => item.value);
    const maxValue = Math.max(...dataValues);
    const yAxis = this.chartHeight / maxValue;

    return this.data
      .map(item => {
        const dataTooltip = ((item.value / maxValue) * 100).toFixed(0);
        const value = Math.floor(item.value * yAxis);

        return `<div style="--value: ${value}" data-tooltip="${dataTooltip}%"></div>`;
      }).join("");
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : "";
  }

  getSubElements(chartElement) {
    const chartSubElements = {};
    const dataElements = chartElement.querySelectorAll('[data-element]');

    for (const subElement of dataElements) {
      const name = subElement.dataset.element;
      chartSubElements[name] = subElement;
    }

    return chartSubElements;
  }

  update(from, to) {
    this.data = [];

    if (!this.data.length) {
      this.element.classList.add("column-chart_loading");
    }

    return fetch(`${BACKEND_URL}/${this.url}?from=${from}&to=${to}`)
      .then(responce => {
        return responce.json();
      })
      .then(newData => {
        this.refreshData(newData);
        return newData;
      })
  }
  
  refreshData(newData) {
    this.data = Object.entries(newData).map(([key, value]) => ( {key, value} ));

    if (this.data.length) {
      this.element.classList.remove("column-chart_loading");
    }

    this.element.querySelector('[data-element="body"]').innerHTML = this.getChartColumns();
  }

  render() {
    const newElement = document.createElement("div");

    newElement.innerHTML = this.getTemplate();

    const chartElement = newElement.firstElementChild;

    this.element = chartElement;
    this.subElements = this.getSubElements(chartElement);

    this.update(this.from, this.to);
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.data = [];
    this.subElements = {};
  }
}
