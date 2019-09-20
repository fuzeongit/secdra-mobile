/**
 *  有关menu的仓库
 *
 *  @author fjj
 */
export const state = () => ({
  name: "home",
  show: false,
  searchShow: false,
  title: ""
})

export const mutations = {
  MChangeName(state, name) {
    state.name = name
  },
  MChangeShow(state, show) {
    state.show = show
  },
  MChangeSearchShow(state, searchShow) {
    state.searchShow = searchShow
  },
  MChangeTitle(state, title) {
    state.title = title
  }
}

export const actions = {}
