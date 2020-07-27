const events = {
  on(eventType: string, handler: Function) {
    if (Array.isArray(this._eventHandlers[eventType])) this._eventHandlers[eventType].push(handler);
    else {
      this._eventHandlers[eventType] = [handler];
    }
  },

  off(eventType: string) {
    if (Array.isArray(this._eventHandlers[eventType])) delete this._eventHandlers[eventType];
  },

  exec(eventType: string, args?: any) {
    if (Array.isArray(this._eventHandlers[eventType]))
      this._eventHandlers[eventType].forEach((handler: Function) => handler.apply(this, args));
  }
};

export default events;
