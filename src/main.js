import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from './routes'
import VueScrollTo from 'vue-scrollto'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import ScrollShowDirective from './directive/ScrollShowDirective'

// // This imports all the layout components such as <b-container>, <b-row>, <b-col>:
// import { LayoutPlugin } from 'bootstrap-vue'
// Vue.use(LayoutPlugin)

// // This imports <b-modal> as well as the v-b-modal directive as a plugin:
// import { ModalPlugin } from 'bootstrap-vue'
// Vue.use(ModalPlugin)

// // This imports <b-card> along with all the <b-card-*> sub-components as a plugin:
// import { CardPlugin } from 'bootstrap-vue'
// Vue.use(CardPlugin)

// // This imports directive v-b-scrollspy as a plugin:
// import { VBScrollspyPlugin } from 'bootstrap-vue'
// Vue.use(VBScrollspyPlugin)

// // This imports the dropdown and table plugins
// import { DropdownPlugin, TablePlugin } from 'bootstrap-vue'
// Vue.use(DropdownPlugin)
// Vue.use(TablePlugin)

let scrollVars = {
  container: 'body',
  duration: 500,
  easing: [0.785, 0.135, 0.150, 0.860],
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
}

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuex)
Vue.use(VueScrollTo, scrollVars)

let store = new Vuex.Store({

  state: {
  },

  getters: {
  },

  actions: {
  },

  mutations: {
  }

})

let scrollShowDirective = ScrollShowDirective
Vue.directive('vpshow', scrollShowDirective)

let v = new Vue({
    el: '#app',
    template: `
    <main>
      <transition name="fade" mode="out-in" appear>
        <router-view />
      </transition>
    </main>`,
    data: {
    },
    components: {
    },
    created(){
    },
    store: store,
    router: VueRouter
})
