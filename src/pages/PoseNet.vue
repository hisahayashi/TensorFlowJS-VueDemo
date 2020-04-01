<template>
  <div id="wrap" class="pt-5 pl-5 pr-5">
    <the-header />

    <!-- contents -->
    <b-container fluid>
      <pose />
    </b-container>
    <!-- //contents -->

    <the-footer />
    <the-loader :is-show="!isLoaded" />
  </div>
</template>
<script>
import Vue from 'vue'
import Pose from '../pose/Pose.vue'
import sleep from '../utils/Sleep'
import Utils from '../utils/Utils'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheLoader from '../components/TheLoader.vue'

const $ = require('jquery')
window.jQuery = $
window.$ = $
require('jquery.easing')

let Component = Vue.extend({

  data() {
    return {
      isLoaded: true,
      isDestroyed: false,
      isOpen: false
    }
  },

  components: {
    TheHeader,
    TheFooter,
    TheLoader,
    Pose
  },

  created() {
  },

  mounted() {
  },

  beforeDestroy() {
    this.isDestroyed = true
  },

  destroyed(){},

  computed: {
  },

  methods: {
  }

})

export default Component
</script>
