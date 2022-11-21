class Tooltip {
  static tooltipExists;
  element;

  constructor() {
    if (Tooltip.tooltipExists) {
      return Tooltip.tooltipExists;
    }

    Tooltip.tooltipExists = this;
  }

  initialize () {
    document.addEventListener('pointerover', this.onPointerOver); // mouse came to element
    document.addEventListener('pointerout', this.onPointerOut);   // mouse left element
  }

  onPointerOver = (event) => {
    const currentElement = event.target.closest('[data-tooltip]');

    if (currentElement) {
      this.render(currentElement.dataset.tooltip);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerOut = () => {
    this.remove();
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove = (event) => {
    this.tooltipCurrentPosition(event);
  };

  tooltipCurrentPosition(event) {
    const offset = 5;

    this.element.style.left = `${event.clientX + offset}px`; // xAxis offset
    this.element.style.top = `${event.clientY + offset}px`;  // yAxis offset
  }

  render(tooltipContent) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = tooltipContent;

    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
