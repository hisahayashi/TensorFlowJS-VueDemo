<template>
  <footer id="foot">
    <p class="logo" v-if="isShowLogo"><span></span></p>
  </footer>
</template>

<script>
import Vue from 'vue'

let Component = Vue.extend({

  props: {
    'isShowLogo': true
  },

  data() {
    return {
    }
  },

  components: {
  },

  created() {
  },

  mounted() {
  },

  methods: {
  }
})

export default Component
</script>
