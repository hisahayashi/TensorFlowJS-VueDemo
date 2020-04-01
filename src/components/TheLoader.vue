<template>
  <transition name="fade" mode="out-in" appear>
    <div class="page_loader" v-if="isShow">
      <div class="inner">
        <p class="loadCircleAnima"></p>
        <p class="text"></p>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'

let Component = Vue.extend({

  props: {
    'isShow': false
  },

  data() {
    return {
    }
  },

  // watch: {
  //   isShow: function(newVal, oldVal) {
  //     console.log('Prop changed: ', newVal, ' | was: ', oldVal)
  //   }
  // },

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
