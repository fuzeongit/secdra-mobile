import LoadingComponent from "./Main"
import Vue from "vue"

const LoadingConstructor = Vue.extend(LoadingComponent)

/**
 * 等待
 * @constructor
 */
export const Loading = function() {
  const instance = new LoadingConstructor({
    data: {
      fixed: true
    }
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  return instance
}
