<template>
  <div id="wrap" class="pt-5 pl-5 pr-5">
    <the-header />

    <!-- contents -->
    <b-container fluid>
      <b-row>
        <b-col cols="12">
          <b-jumbotron header="TensorFlow.js Vue Demo" lead="Tensorflow.js / PoseNet / Body-pix">
            <p>For more information visit website</p>
            <b-button variant="primary" href="https://www.tensorflow.org/js">More Info</b-button>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
    <!-- //contents -->

    <the-footer />
    <the-loader :is-show="!isLoaded" />
  </div>
</template>
<script>
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import PoseMain from '../pose/PoseMain'
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
      isOpen: false,
      poseMain: {},
      sample_modal: false
    }
  },

  components: {
    TheHeader,
    TheFooter,
    TheLoader
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
