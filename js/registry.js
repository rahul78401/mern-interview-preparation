/* Tiny registry. Content files call Learn.register({...}) before app.js runs. */
window.Learn = {
  site: {},
  modules: [],
  updates: [],
  register(module) {
    this.modules.push(module);
  },
};
