import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
      loading: true,
      userProfile: {}
    }
  },
  mutations: {
    switchLoading (state, mode) {
      state.loading = mode
    },
    setUserProfile (state, data) {
      state.userProfile = {...state.userProfile, ...data}
    },
    clearUserProfile (state) {
      state.userProfile = {}
    }
  }
})

export default store