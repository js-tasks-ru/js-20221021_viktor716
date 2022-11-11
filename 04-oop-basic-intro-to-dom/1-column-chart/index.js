export default class ColumnChart {
  chartHeight = 50;

  constructor ( {
    data = [],
    label = "",
    value = 0,
    link = "",
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

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
    const maxValue = Math.max(...this.data);
    const yAxis = this.chartHeight / maxValue;

    return this.data
      .map(item => {
        const dataTooltip = ((item / maxValue) * 100).toFixed(0);
        const value = Math.floor(item * yAxis);

        return `<div style="--value: ${value}" data-tooltip="${dataTooltip}%"></div>`;
      }).join("");
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : "";
  }

  update(data = []) {
    if (!this.data.length) {
      this.element.classList.add("column-chart_loading");
    }

    this.data = data;
    this.element.querySelector('[data-element="body"]').innerHTML = this.getChartColumns();
  }

  render() {
    const newElement = document.createElement("div");

    newElement.innerHTML = this.getTemplate();

    this.element = newElement.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove("column-chart_loading");
    }
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = {};
  }
}
