import Vue from 'vue'

import Http from '../assets/js/util/httpUtil'
import Img from '../assets/js/util/imgUrlUtil'
import filters from "../assets/js/filter"
import directive from "../assets/js/directive"
import {Alert} from "../components/global/Alert"
import {Confirm} from "../components/global/Confirm"
import {Tooltip} from "../components/global/Tooltip"
import Pageable from "../components/global/Pageable"

Vue.prototype.$alert = Alert;
Vue.prototype.$confirm = Confirm;
Vue.prototype.$tooltip = Tooltip;
Vue.component("Pageable",Pageable);

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
