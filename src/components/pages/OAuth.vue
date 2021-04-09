<template>
  <div>
    <section class="mb-3">
      <h3 class="mb-1">{{userProfile.name ? 'Hello, ' : '　'}}{{userProfile.name || '　'}}</h3>
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
import firebase from '@/common/firebase'
import { useStore } from 'vuex'
import {ref, reactive, onMounted} from 'vue'
import Utils from '@/utils/utils.js'
import Button from '@/components/utils/CustomButton'

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
    const authList = reactive({
      google: {func: 'GoogleAuthProvider', signin: isGoogleSignin},
      facebook: {func: 'FacebookAuthProvider', signin: isFBSignin}
    })
    function userSignin(platform) {
      switchLoading(true)
      let functionName = authList[platform].func
      const provider = new firebase.auth[functionName]()
      firebase.auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithRedirect(provider)
        }).catch(err => {
          console.log(err)
          switchLoading(false)
        })
    }
    // Sign Out
    function userSignout () {
      firebase.auth().signOut().then(() => {
        Object.keys(authList).forEach(p => { authList[p].signin = false })
        Utils.clearUrlParams()
      })
      userProfile.value = {}
    }
    // 檢查登入狀態
    function handleUserState () {
      firebase.auth().onAuthStateChanged(user => {
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
        Utils.addUrlParams('to', email)
      } else if (platform.includes('facebook')) {
        const {displayName, photoURL} = data
        sendMail(displayName, photoURL)
        userProfile.value = {name: displayName, photo: photoURL}
        Utils.addUrlParams('name', displayName)
        Utils.addUrlParams('photo', photoURL)
      }
      authList[platform].signin = true
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

<style lang='scss' scoped>

</style>
