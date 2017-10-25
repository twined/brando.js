import * as components from './components'

/* eslint-disable no-var, no-undef, guard-for-in, object-shorthand */

const VuePlugin = {
    install: function (Vue) {
        if (Vue._kurtz_installed) {
            return
        }

        Vue._kurtz_installed = true

        // Register components
        for (var component in components) {
            Vue.component(component, components[component])
        }
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePlugin)
}

export default VuePlugin
