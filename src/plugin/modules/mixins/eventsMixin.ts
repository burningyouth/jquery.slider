const events = {
  on(eventType: string, handler: Function) {
    const eventTypes = eventType.split(' ');
    eventTypes.forEach((event) => {
      if (this._eventHandlers[event]) this._eventHandlers[event].push(handler);
      else {
        this._eventHandlers[event] = [handler];
      }
    });
  },

  off(eventType: string) {
    const eventTypes = eventType.split(' ');
    eventTypes.forEach((event) => {
      if (this._eventHandlers[event]) delete this._eventHandlers[event];
    });
  },

  exec(eventType: string, ...args: any) {
    const eventTypes = eventType.split(' ');
    eventTypes.forEach((event) => {
      if (this._eventHandlers[event])
        this._eventHandlers[event].forEach((handler: Function) =>
          handler.call(this, ...args),
        );
    });
  },
};

export default events;
