<template>
  <div id="wrap">
    <the-header :is-show-logo="true" :is-show-back="true" />

    <!-- contents -->
    <article class="common_container">

      <header class="title_section">
        <h1></h1>
      </header>

      <section class="common_section">
        <div class="text">404 not found.</div>
        <p class="btn"><router-link :to="{name: 'Index', params: {}}">top page</router-link></p>
      </section>

    </article>
    <!-- //contents -->

    <the-footer :is-show-logo="false" />
    <the-loader v-if="!isLoaded" />
  </div>
</template>

<script>
import Vue from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheLoader from '../components/TheLoader.vue'

let Component = Vue.extend({

  data() {
    return {
      isLoaded: true
    }
  },

  components: {
    TheHeader,
    TheFooter,
    TheLoader,
  },

  created() {
  },

  mounted() {
    this.isLoaded = false
  },

  computed: {
  },

  methods: {
  }

})

export default Component
</script>
