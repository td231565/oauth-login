import firebase from './config.js'
import Utils from '@/common/utils/utils.js'

const providerList = {
  google: 'GoogleAuthProvider',
  facebook: 'FacebookAuthProvider'
}
// Sign In
const signin = (platform) => {
  let functionName = providerList[platform]
  const provider = new firebase.auth[functionName]()
  return firebase.auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      firebase.auth().signInWithRedirect(provider)
    }).catch(err => {
      console.log(err)
    })
}
// Sign Out
const signout = () => {
  return firebase.auth().signOut().then(() => {
    Utils.clearUrlParams()
  })
}
// Listen Auth State
const onAuthStateChanged = () => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(user => {
      resolve(user)
    })
  })
}

export default {
  signin,
  signout,
  onAuthStateChanged
}