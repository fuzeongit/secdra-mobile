/**
 *  有关menu的仓库
 *
 *  @author fjj
 */
export const state = () => ({
  name:"home",
  isShow:false,
  searchIsShow:false,
  title:""
});

export const mutations = {
  MChangeName(state, name) {
    state.name = name;
  },
  MChangeShow(state, isShow) {
    state.isShow = isShow;
  },
  MChangeSearchShow(state, searchIsShow) {
    state.searchIsShow = searchIsShow;
  },
  MChangeTitle(state, title) {
    state.title = title;
  },
};

export const actions = {};
