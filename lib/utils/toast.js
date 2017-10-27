import iziToast from 'izitoast'

export default function install (Vue) {
  Object.defineProperties(Vue.prototype, {
    $iziToast: {
      get () {
        iziToast.settings({
          position: 'topRight',
          title: '',
          animateInside: false,
          timeout: 5000,
          iconColor: '#ffffff',
          theme: 'kurtz'
        })
        return iziToast
      }
    }
  })
}
