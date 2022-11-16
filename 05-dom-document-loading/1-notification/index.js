export default class NotificationMessage {
  static currentMessage;
  element;
  currentTimeout;

  constructor(message = "", {
    duration = 1000,
    type = "success"
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  getTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>
    `
  }

  show(placeToShow = document.body) {
    if (NotificationMessage.currentMessage) {
      NotificationMessage.currentMessage.remove();
    }

    placeToShow.append(this.element);
    NotificationMessage.currentMessage = this;

    this.currentTimeout = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  render() {
    const newElement = document.createElement("div");

    newElement.innerHTML = this.getTemplate();

    this.element = newElement.firstElementChild;
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }

    this.currentTimeout = null;
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.currentMessage = null;
  }
}
