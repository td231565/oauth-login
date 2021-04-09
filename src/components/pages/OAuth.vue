<template>
  <div>
    <section class="mb-3">
      <h3 class="mb-1">{{userProfile.name ? 'Hello, ' : '\u0001'}}{{userProfile.name || '\u0001'}}</h3>
      <div style="width: 50px; height: 50px; margin: auto;"
        :style="`background-image: url(${userProfile.photo})`"></div>
    </section>
    <section>
      <Button v-if="!isGoogleSignin && !isFBSignin" class="btn" @click="userSignin('google')">Google SignIn</Button>
      <Button v-if="isGoogleSignin && !isFBSignin" class="btn" @click="userSignin('facebook')">FB SignIn</Button>
      <Button v-if="isGoogleSignin || isFBSignin" class="btn" @click="userSignout">Sign Out</Button>
    </section>
  </div>
</template>

<script>
import {ApiMail} from '@/common/api'
import {useStore} from 'vuex'
import {ref, reactive, onMounted} from 'vue'
import Utils from '@/utils/utils.js'
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
    const userProfile = ref({name: '', photo: ''})
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
        userProfile.value = {}
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
        userProfile.value = {name: displayName, photo: photoURL}
        Object.keys(userProfile.value).forEach(key => {
          Utils.addUrlParam(key, userProfile.value[key])
        })
      }
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

    return {
      isGoogleSignin,
      isFBSignin,
      userSignin,
      userSignout,
      userProfile
    }
  }
}
</script>
