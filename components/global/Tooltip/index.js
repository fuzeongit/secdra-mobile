import Vue from 'vue';
import TooltipComponent from './Main';

const TooltipConstructor = Vue.extend(TooltipComponent);

/**
 * 信息
 * @param {{message:String},{waitTime?:Number},{callback?:Function}} messageOption
 * @constructor
 */
export const Tooltip = function (messageOption = {}) {
  let instance = new TooltipConstructor({
    data: messageOption
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
