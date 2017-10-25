<template>
  <transition :duration="500" name="modal">
    <div class="modal" style="display: block;" v-show="show">
      <div @click.stop="cancel" class="modal-backdrop" key="backdrop"></div>
      <div class="modal-dialog" :class="modalClass" ref="dialog" role="document" v-if="chrome === true">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="section mb-0 modal-title">
              <slot name="title">
                {{ title }}
              </slot>
            </h5>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-outline-primary" @click="cancel" data-dismiss="modal" v-if="showCancelButton">{{ cancelText }}</button>
              <button type="button" class="btn btn-primary" @click="ok" data-dismiss="modal">{{ okText }}</button>
            </slot>
          </div>
        </div>
      </div>
      <div class="modal-no-chrome" :class="modalClass" v-else>
        <div class="modal-no-chrome-content" ref="dialog" role="document">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * Bootstrap Style Modal Component for Vue
 * Depend on Bootstrap.css
 */

export default {
  props: {
    show: {
      type: Boolean,
      twoWay: true,
      default: false
    },
    chrome: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Modal'
    },
    small: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    },
    // 为true时无法通过点击遮罩层关闭modal
    force: {
      type: Boolean,
      default: false
    },
    // 自定义组件transition
    transition: {
      type: String,
      default: 'modal'
    },
    // 确认按钮text
    okText: {
      type: String,
      default: 'OK'
    },
    // 取消按钮text
    cancelText: {
      type: String,
      default: 'Tilbake'
    },
    // 确认按钮className
    okClass: {
      type: String,
      default: 'btn blue'
    },
    // 取消按钮className
    cancelClass: {
      type: String,
      default: 'btn red btn-outline'
    },
    // 点击确定时关闭Modal
    // 默认为false，由父组件控制prop.show来关闭
    closeWhenOK: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    }
  },
  name: 'modal',
  data () {
    return {
      duration: null
    }
  },
  computed: {
    modalClass () {
      return {
        'modal-lg': this.large,
        'modal-sm': this.small,
        'modal-full': this.full
      }
    }
  },
  created () {
    if (this.show) {
      document.body.className += ' modal-open'
    }
  },
  beforeDestroy () {
    document.body.className = document.body.className.replace(/\s?modal-open/, '')
  },
  watch: {
    show (value) {
      if (value) {
        document.body.className += ' modal-open'
      } else {
        if (!this.duration) {
          this.duration = window.getComputedStyle(this.$refs.dialog)['transition-duration'].replace('s', '') * 500
        }

        window.setTimeout(() => {
          document.body.className = document.body.className.replace(/\s?modal-open/, '')
        }, this.duration || 0)
      }
    }
  },
  methods: {
    ok () {
      this.$emit('ok')
    },
    cancel () {
      this.$emit('cancel')
    },
    // 点击遮罩层
    clickMask () {
      if (!this.force) {
        this.cancel()
      }
    }
  }
}
</script>
