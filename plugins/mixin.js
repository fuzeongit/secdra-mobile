import Vue from "vue"
import VueLazyload from "vue-lazyload"
import { Alert, Confirm, Tooltip } from "../components/global"
import Popper from "../components/global/Popper"
import Model from "../components/global/Model"
import DatePicker from "../components/global/DatePicker/Main"
import Tag from "../components/global/Tag"
import Pageable from "../components/global/Pageable"
import CheckboxGroup from "../components/form/CheckboxGroup"
import Checkbox from "../components/form/Checkbox"
import RadioGroup from "../components/form/RadioGroup"
import Radio from "../components/form/Radio"
import Btn from "../components/form/Btn"
import Field from "../components/form/Field"
import DateInput from "../components/form/DateInput"

import Http from "../assets/script/util/httpUtil"
import Img from "../assets/script/util/imgUrlUtil"
import filters from "../assets/script/filter"
import directive from "../assets/script/directive"
import { enumObjectList } from "../assets/script/constant"

Vue.prototype.$alert = Alert
Vue.prototype.$confirm = Confirm
Vue.prototype.$tooltip = Tooltip
Vue.component("Popper", Popper)
Vue.component("Model", Model)
Vue.component("DatePicker", DatePicker)
Vue.component("Tag", Tag)
Vue.component("Pageable", Pageable)
Vue.component("CheckboxGroup", CheckboxGroup)
Vue.component("Checkbox", Checkbox)
Vue.component("RadioGroup", RadioGroup)
Vue.component("Radio", Radio)
Vue.component("Btn", Btn)
Vue.component("Field", Field)
Vue.component("DateInput", DateInput)

Vue.prototype.$http = Http
Vue.prototype.$img = Img

Vue.prototype.$filter = filters
Vue.prototype.$enum = enumObjectList

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.directive("popover", directive.popover)
Vue.directive("loading", directive.loading)
Vue.directive("ripple", directive.ripple)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
