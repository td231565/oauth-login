<template>
  <div v-if="loading" class="loading"><h2>Loading...</h2></div>
  <section style="display: flex; justify-content: center; padding-top: 3rem;">
    <div>
      <div class="mb-3">
        <Profile />
      </div>
      <OAuth />
      <p class="mt-4">此web程式將取得您的gmail信箱、FB大頭貼、FB名稱，僅作展示用途，不以任何形式保存。請依以下步驟執行</p>
      <ol>
        <li>1. 登入Google帳號</li>
        <li>2. 登入Facebook帳號</li>
        <li>3. 登入成功後將寄送信件至Gmail通知</li>
      </ol>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import OAuth from './components/pages/OAuth'
import Profile from './components/pages/Profile'

export default {
  name: 'App',
  components: {
    OAuth,
    Profile
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
