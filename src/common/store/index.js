import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
      loading: true
    }
  },
  mutations: {
    switchLoading (state, mode) {
      state.loading = mode
    }
  }
})

export default store