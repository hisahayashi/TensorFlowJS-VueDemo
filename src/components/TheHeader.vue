<template>
  <header id="head">

    <b-container fluid class="mb-5">
      <b-row>

        <b-col cols="3">
          <h1><router-link :to="{name: 'Index'}">TensorFlow.js Vue Demo</router-link></h1>
        </b-col>

        <b-col cols="9">
          <b-navbar toggleable="md" type="" variant="light">
            <b-collapse is-nav id="">
              <b-navbar-nav>
                <b-nav-item :to="{name: 'BodyPix'}">BodyPix</b-nav-item>
                <b-nav-item :to="{name: 'PoseNet'}">PoseNet</b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </b-col>

      </b-row>
    </b-container>

  </header>
</template>

<script>
import Vue from 'vue'
import Utils from '../utils/Utils'
import UserAgant from '../utils/UserAgant'
const $ = require('jquery')

let Component = Vue.extend({

  mixins: [Utils],

  props: {
  },

  data() {
    return {
      isHome: false,
    }
  },

  components: {
  },

  created() {
  },

  mounted() {
  },

  destroyed() {
  },

  computed: {
  },

  methods: {
  }
})

export default Component
</script>
