class NotificationObserver {
  constructor() {
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  notify(event) {
    this.subscribers.forEach(callback => callback(event));
  }
}

module.exports = NotificationObserver;
