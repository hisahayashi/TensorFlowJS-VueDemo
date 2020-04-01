class UserAgant {

  constructor() {
    this.ua = window.navigator.userAgent.toLowerCase()
    this.ver = window.navigator.appVersion.toLowerCase()
  }

  browser() {
    let b = ''
    // Edge
    if (this.ua.indexOf('edge') !== -1) {
      b = 'edge'
    }
    // ieMobile
    else if (this.ua.indexOf('iemobile') !== -1) {
      b = 'iemobile'
    }
    // ie11
    else if (this.ua.indexOf('trident/7') !== -1) {
      b = 'ie11'
    }
    // ie
    else if (this.ua.indexOf('msie') !== -1 && this.ua.indexOf('opera') === -1) {
      // ie6
      if (this.ver.indexOf('msie 6.') !== -1) {
        b = 'ie6'
      }
      // ie7
      else if (this.ver.indexOf('msie 7.') !== -1) {
        b = 'ie7'
      }
      // ie8
      else if (this.ver.indexOf('msie 8.') !== -1) {
        b = 'ie8'
      }
      // ie9
      else if (this.ver.indexOf('msie 9.') !== -1) {
        b = 'ie9'
      }
      // ie10
      else if (this.ver.indexOf('msie 10.') !== -1) {
        b = 'ie10'
      }
    }
    // Chrome
    else if (this.ua.indexOf('chrome') !== -1 && this.ua.indexOf('edge') === -1) {
      b = 'chrome'
    }
    // Safari
    else if (this.ua.indexOf('safari') !== -1 && this.ua.indexOf('chrome') === -1) {
      b = 'safari'
    }
    // Opera
    else if (this.ua.indexOf('opera') !== -1) {
      b = 'opera'
    }
    // Firefox
    else if (this.ua.indexOf('firefox') !== -1) {
      b = 'firefox'
    }
    // Unknown
    else {
      b = 'unknown_browser'
    }
    return b
  }

  device() {
    if (this.ua.indexOf('iphone') !== -1 || this.ua.indexOf('ipod') !== -1) return 'iphone'
    else if (this.ua.indexOf('ipad') !== -1) return 'ipad'
    else if (this.ua.indexOf('android') !== -1) return 'android'
    else if (this.ua.indexOf('windows') !== -1 && this.ua.indexOf('phone') !== -1) return 'windows_phone'
    else return ''
  }

  iosVersion() {
    let value = 0
    if (this.isiOS()) {
    // if (/iP(hone|od|ad)/.test(navigator.platform)) {
      let v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
      let versions = [
        parseInt(v[1], 10),
        parseInt(v[2], 10),
        parseInt(v[3] || '0', 10)
      ]
      value = versions[0]
    }
    else{
      value = 0
    }
    return value
  }

  androidVersion() {
    let ua = this.ua.toLowerCase()
    let match = ua.match(/android\s([0-9\.]*)/)
    if(match){
      return parseFloat(match[1])
    }
    else{
      return 0
    }
  }

  isIE() {
    let browser = this.browser()
    if(browser.substr(0, 2) === 'ie' && browser !== 'iemobile'){
      return true
    }
    else{
      return false
    }
  }

  isiOS() {
    let device = this.device()
    return (device === 'iphone' || device === 'ipad')
  }

  isAndroid() {
    let ua = this.ua.toLowerCase()
    if(ua.indexOf('android') > -1){
      return true
    }
    else{
      return false
    }
  }

  isMobile() {
    let device = this.device()
    return (this.ua.indexOf('mobi') !== -1 || device === 'iphone' || (device === 'windows_phone' && this.ua.indexOf('wpdesktop') === -1) || device === 'iemobile')
  }

  isTablet() {
    let device = this.device()
    let isMobile = this.isMobile()
    return (device === 'ipad' || (device === 'android' && !isMobile))
  }

  isTouch() {
    return ('ontouchstart' in window)
  }

  isModern() {
    let browser = this.browser()
    let iosVersion = this.iosVersion()
    return !(browser === 'ie6' || browser === 'ie7' || browser === 'ie8' || browser === 'ie9' || (0 < iosVersion && iosVersion < 8))
  }

  homeClass() {
    let browser = this.browser()
    let device = this.device()
    let classStr = ''
    classStr += (browser !== '') ? browser + ' ' : 'browser-unknown ',
      classStr += (device !== '') ? device + ' ' : 'device-unknown ',
      classStr += (this.isMobile()) ? 'mobile ' : 'desktop ',
      classStr += (this.isTouch()) ? 'touch ' : 'mouse ',
      classStr += (this.isiOS()) ? 'ios ' : '',
      classStr += (this.isIE()) ? 'ie ' : '',
      classStr += (this.isModern()) ? 'modern ' : 'old '
    return classStr
  }

  addClass(){
    let homeClass = this.homeClass()
    document.addEventListener('DOMContentLoaded', function() {
      document.documentElement.className += homeClass
    })
  }

}

export default UserAgant
