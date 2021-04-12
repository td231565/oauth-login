<template>
  <Button v-if="!isGoogleSignin && !isFBSignin" class="btn" @click="userSignin('google')">Google SignIn</Button>
  <Button v-if="isGoogleSignin && !isFBSignin" class="btn" @click="userSignin('facebook')">FB SignIn</Button>
  <Button v-if="isGoogleSignin || isFBSignin" class="btn" @click="userSignout">Sign Out</Button>
</template>

<script>
import {ApiMail} from '@/common/api'
import {useStore} from 'vuex'
import {ref, reactive, onMounted} from 'vue'
import Utils from '@/common/utils/utils.js'
import Button from '@/components/utils/CustomButton'
import Auth from '@/common/firebase'

export default {
  name: 'OAuth',
  components: {
    Button
  },
  emits: {
  },
  setup () {
    const isGoogleSignin = ref(false)
    const isFBSignin = ref(false)
    // Sign In
    const platformList = reactive({
      google: {signin: isGoogleSignin},
      facebook: {signin: isFBSignin}
    })
    function userSignin(platform) {
      switchLoading(true)
      Auth.signin(platform).catch(() => {switchLoading(false)})
    }
    // Sign Out
    function userSignout () {
      switchLoading(true)
      Auth.signout().then(() => {
        Object.keys(platformList).forEach(p => { platformList[p].signin = false })
        clearUser()
        switchLoading(false)
      })
    }
    // 檢查登入狀態
    function handleUserState () {
      Auth.onAuthStateChanged().then(user => {
        switchLoading(false)
        if (user) {
          const platform = user.providerData[0].providerId
          handleUserSignin(platform, user)
        }
      })
    }
    onMounted(() => {
      handleUserState()
    })
    // 登入成功處理
    function handleUserSignin (platform, data) {
      platform = platform.replace('.com', '')
      if (platform.includes('google')) {
        const {email} = data
        Utils.addUrlParam('to', email)
      } else if (platform.includes('facebook')) {
        const {displayName, photoURL} = data
        sendMail(displayName, photoURL)
        Utils.addUrlParam('name', displayName)
        Utils.addUrlParam('photo', photoURL)
      }
      const params = Utils.getUrlParams()
      setUser(params)
      platformList[platform].signin = true
    }
    // 寄信給 gmail 含FB大頭貼和姓名
    function sendMail (name, photo) {
      const params = Utils.getUrlParams()
      if (!params.name) {
        ApiMail.send(params.to, name, photo).then(() => {
          console.log('send success')
        }).catch(e => {
          console.log(e)
        })
      }
    }
    // 讀取畫面
    const store = useStore()
    function switchLoading (mode) {
      store.commit('switchLoading', mode)
    }
    function setUser (data) {
      store.commit('setUserProfile', data)
    }
    // 清空登入資料
    function clearUser () {
      store.commit('clearUserProfile')
    }

    return {
      isGoogleSignin,
      isFBSignin,
      userSignin,
      userSignout
    }
  }
}
</script>
