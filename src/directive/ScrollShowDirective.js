const $ = require('jquery')

export default {

  bind(el, binding) {
    // console.log('Vue.directive', 'bind', el, binding)
    el.classList.add('before-enter')

    let inViewport = (el) => {
      // console.log('Vue.directive', 'inViewport', el, binding)
      let rect = el.getBoundingClientRect()
      return !(rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight)
    }

    el.$onScroll = () => {
      if (inViewport(el)) {
        el.classList.add('enter')
        el.classList.remove('before-enter')
        binding.def.unbind(el, binding)
      }
    }
    $(document).on('scroll', el.$onScroll)
  },

  inserted(el, binding) {
    // console.log('Vue.directive', 'inserted', el, binding)
    el.$onScroll()
  },

  unbind(el) {
    // console.log('Vue.directive', 'unbind', el, binding)
    $(document).off('scroll', el.$onScroll)
    delete el.$onScroll
  }
}
