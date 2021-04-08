<template>
  <div v-if="isFBSignin">
    <p>{{userProfile.name}}</p>
    <img :src="userProfile.photo" alt="">
  </div>
  <Button v-if="!isGoogleSignin && !isFBSignin" class="btn" @click="userSignin('google')">Google SignIn</Button>
  <Button v-if="isGoogleSignin && !isFBSignin" class="btn" @click="userSignin('facebook')">FB SignIn</Button>
  <Button v-if="isGoogleSignin || isFBSignin" class="btn" @click="userSignout">Sign Out</Button>
</template>

<script>
import {ApiMail} from '@/common/api'
import firebase from '@/common/firebase'
import { useStore } from 'vuex'
import {ref, reactive, onMounted} from 'vue'
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
      google: {func: 'GoogleAuthProvider', signin: false},
      facebook: {func: 'FacebookAuthProvider', signin: false}
    })
    function userSignin(platform) {
      switchLoading(true)
      let functionName = authList[platform].func
      const provider = new firebase.auth[functionName]()
      firebase.auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithPopup(provider)
            .then(() => {
              // var credential = result.credential
              // var token = credential.accessToken
            }).catch(err => {
              console.log(err)
              switchLoading(false)
            })
        }).catch(err => {
          console.log(err)
          switchLoading(false)
        })
    }
    // Sign Out
    function userSignout () {
      firebase.auth().signOut().then(() => {
        isGoogleSignin.value = false
        isFBSignin.value = false
      })
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
    let gmail = ''
    function handleUserSignin (platform, data) {
      if (platform.includes('google')) {
        const {email} = data
        gmail = email
        isGoogleSignin.value = true
      } else if (platform.includes('facebook')) {
        const {displayName, photoURL} = data
        userProfile.value = {name: displayName, photo: photoURL}
        sendMail(gmail, displayName, photoURL)
        isFBSignin.value = true
      }
    }
    // 寄信給 gmail 含FB大頭貼和姓名
    function sendMail (to, name, photo) {
      ApiMail.send(to, name, photo).then(() => {
        console.log('send success')
      }).catch(e => {
        console.log(e)
      })
    }
    // 讀取
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
