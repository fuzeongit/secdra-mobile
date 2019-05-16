import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import Http from '../assets/script/util/httpUtil'
import Img from '../assets/script/util/imgUrlUtil'
import filters from "../assets/script/filter"
import directive from "../assets/script/directive"
import {Alert} from "../components/global/Alert"
import {Confirm} from "../components/global/Confirm"
import {Tooltip} from "../components/global/Tooltip"
import Popper from "../components/global/Popper"
import Pageable from "../components/global/Pageable"
import RadioGroup from "../components/form/RadioGroup"
import Radio from "../components/form/Radio"
import Switch from "../components/form/Switch";

Vue.prototype.$alert = Alert;
Vue.prototype.$confirm = Confirm;
Vue.prototype.$tooltip = Tooltip;
Vue.component("Popper", Popper);
Vue.component("Pageable", Pageable);
Vue.component("RadioGroup", RadioGroup);
Vue.component("Radio", Radio);
Vue.component("SSwitch", Switch);

Vue.prototype.$http = Http;
Vue.prototype.$img = Img;

Vue.prototype.$filter = filters;
for (let name in filters) {
  Vue.filter(name, filters[name])
}

Vue.directive("goTop", directive.goTop);
Vue.directive("popover", directive.popover);
Vue.directive("loading", directive.loading);
Vue.directive("swipe", directive.swipe);

//取消 Vue 所有的日志与警告。
Vue.config.silent = true;

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
});
