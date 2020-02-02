import stompUtil from "../util/stompUtil"
import { mapState } from "vuex"

export default {
  data() {
    return {
      _subList: []
    }
  },
  watch: {
    status(newVal, oldVal) {
      if (newVal && !oldVal) {
        this._subscribe()
      }
    }
  },
  computed: {
    ...mapState("stomp", ["status"])
  },
  mounted() {
    if (this.status) {
      this._subscribe()
    }
  },
  beforeDestroy() {
    let sub
    if (this._subList) {
      while ((sub = this._subList.shift())) {
        sub.unsubscribe()
      }
    }
  },
  methods: {
    _subscribe() {
      const stompSubscribeList = this.stompSubscribeList()
      this._subList = stompSubscribeList.map((item) => {
        stompUtil.client.subscribe(item.eventName, item.callback)
      })
    },
    stompSubscribeList() {
      return []
    }
  }
}
