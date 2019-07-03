<template>
  <div @click="openPage">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: [Object, String],
      required: true
    }
  },
  methods: {
    openPage () {
      this.$openPage(this.to)
    }
  }
}
</script>
