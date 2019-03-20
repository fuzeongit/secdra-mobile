export default {
  inserted(el, binding, vnode) {
    let events = ["swipe", "swipeleft", "swiperight", "swipeup", "swipedown"];
    let fun = binding.value;
    let event = binding.arg;
    if (events.indexOf(event) === -1) {
      throw new Error(`event need ${events.join("、")}`)
    }
    if (typeof fun !== "function") {
      throw new Error(`value is not function`)
    }
    let Hammer = require("hammerjs");
    let manager = new Hammer.Manager(el);
    manager.add(new Hammer.Swipe());
    manager.on(event || "swipe", fun);
    el.manager = manager;
  }
}
