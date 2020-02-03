export default ({ app }) => {
  app.router.afterEach(() => {
    app.store.commit("menu/MChangeTitle", "")
  })
}
