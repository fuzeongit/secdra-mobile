import Vue from 'vue'

import Http from '../assets/js/util/httpUtil'
import Img from '../assets/js/util/imgUrlUtil'
import filters from "../assets/js/filter"
import directive from "../assets/js/directive"

Vue.prototype.$http = Http;

Vue.prototype.$img = Img;

Vue.prototype.$filter = filters;
for (let name in filters) {
  Vue.filter(name, filters[name])
}

Vue.directive("goTop", directive.goTop);
Vue.directive("popover", directive.popover);
Vue.directive("loading", directive.loading);
