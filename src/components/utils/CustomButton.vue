<template>
  <div class="btn__container">
    <button class="btn__main">
      <span class="btn__circle" aria-hidden="true">
        <span class="icon arrow"></span>
      </span>
      <span class="btn__text">
        <slot></slot>
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CustomButton'
}
</script>
