const events = {
  on(eventType: string, handler: Function) {
    if (this._eventHandlers[eventType]) this._eventHandlers[eventType].push(handler);
    else {
      this._eventHandlers[eventType] = [handler];
    }
  },

  off(eventType: string) {
    if (this._eventHandlers[eventType]) delete this._eventHandlers[eventType];
  },

  exec(eventType: string, ...args: any) {
    if (this._eventHandlers[eventType])
      this._eventHandlers[eventType].forEach((handler: Function) => handler.call(this, ...args));
  }
};

export default events;
