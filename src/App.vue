<template>
  <div v-if="loading" class="loading"><h2>Loading...</h2></div>
  <div style="display: flex; justify-content: center; padding-top: 3rem;">
    <OAuth />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import OAuth from './components/pages/OAuth.vue'

export default {
  name: 'App',
  components: {
    OAuth
  },
  setup () {
    const store = useStore()
    const loading = computed(() => store.state.loading)
    return {
      loading
    }
  }
}
</script>

<style lang="scss">
@import './assets/style';
</style>
