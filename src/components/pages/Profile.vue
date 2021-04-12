<template>
  <h3 class="mb-1">{{userProfile.to ? 'Gmail: ' : '\u0001'}}{{userProfile.to || '\u0001'}}</h3>
  <h3 class="mb-1">{{userProfile.name ? 'Hello, ' : '\u0001'}}{{userProfile.name || '\u0001'}}</h3>
  <div style="width: 50px; height: 50px; margin: auto;"
    :style="`background-image: url(${userProfile.photo})`"></div>
</template>

<script>
import {computed} from 'vue'
import {useStore} from 'vuex'

export default {
  name: 'Profile',
  props: {
  },
  emits: {
  },
  setup () {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)

    return {
      userProfile
    }
  }
}
</script>
