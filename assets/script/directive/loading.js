import LoadingComponent from "../../../components/global/Loading/Main"
import Vue from "vue"

const LoadingConstructor = Vue.extend(LoadingComponent)

function loading(el) {
  const instance = new LoadingConstructor()
  instance.vm = instance.$mount()
  const elPosition = window.getComputedStyle(el).position

  if (
    elPosition !== "fixed" &&
    elPosition !== "absolute" &&
    elPosition !== "relative"
  ) {
    el.classList.add("loading-parent")
  }
  el.appendChild(instance.vm.$el)
  el.loading = instance.vm.$el
}

export default {
  inserted(el, binding) {
    binding.value && loading(el, binding)
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        loading(el, binding)
      } else {
        try {
          el.classList.remove("loading-parent")
        } catch (e) {}
        el.removeChild(el.loading)
      }
    }
  }
}
