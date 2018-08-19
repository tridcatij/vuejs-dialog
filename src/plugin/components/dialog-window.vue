<template>
    <div>
          <div v-if="show" class="ui dimmer modals page transition" :class="['active']">
        <transition :name="animation" @after-leave="animationEnded('content')" appear>
            <div :class="['ui', 'mini', 'active', 'modal']">
                <div class="content" v-html="options.message"></div>
                <div class="actions">
                    <button @click="clickLeftBtn()" :is="leftBtnComponent" :loading="loading" :enabled="leftBtnEnabled" :options="options" :focus="leftBtnFocus">
                        <span v-if="options.html" v-html="leftBtnText"></span>
                        <span>{{ leftBtnText }}</span>
                    </button>
                    <button :is="rightBtnComponent" @click="clickRightBtn()" :loading="loading" :enabled="rightBtnEnabled" :options="options" :focus="rightBtnFocus">
                        <span v-if="options.html" v-html="rightBtnText"></span>
                        <span>{{ rightBtnText }}</span>
                    </button>
                    <div class="dg-clear"></div>
                </div>
            </div>
        </transition>
          </div>
    </div>
</template>
<script>
import OkBtn from './ok-btn.vue'
import CancelBtn from './cancel-btn.vue'
import {
    DIALOG_TYPES,
    ANIMATION_TYPES,
    CONFIRM_TYPES
} from '../js/constants'

export default {
    data: function() {
        return {
            input: '',
            show: true,
            loading: false,
            closed: false,
            endedAnimations: []
        }
    },
    props: {
        options: {
            type: Object,
            required: true
        },
        escapeKeyClose: {
            type: Boolean,
            "default": false
        }
    },
    watch: {
        "escapeKeyClose": function(val) {
            if (val === true) {
                this.cancelBtnDisabled ? this.proceed() : this.cancel()
            }
        }
    },
    computed: {
        animation() {
            let a = this.options.animation.toUpperCase()
            return ANIMATION_TYPES.hasOwnProperty(a) ? ANIMATION_TYPES[a] : ANIMATION_TYPES.ZOOM
        },
        loaderEnabled() {
            return !!this.options.loader
        },
        isHardConfirm() {
            return this.options.window === DIALOG_TYPES.CONFIRM && this.options.type === CONFIRM_TYPES.HARD
        },
        isPrompt() {
            return (this.options.window === DIALOG_TYPES.PROMPT)
        },
        cancelBtnDisabled() {
            return (this.options.window === DIALOG_TYPES.ALERT)
        },
        okBtnDisabled() {
            return (this.options.window === DIALOG_TYPES.CONFIRM) && (this.options.type === CONFIRM_TYPES.HARD) && (this.input !== this.options.verification)
        },
        leftBtnEnabled() {
            return (this.cancelBtnDisabled === false) || (this.options.reverse === true)
        },
        rightBtnEnabled() {
            return (this.cancelBtnDisabled === false) || (this.options.reverse === false)
        },
        leftBtnComponent() {
            return (this.options.reverse === false) ? 'cancel-btn' : 'ok-btn'
        },
        rightBtnComponent() {
            return (this.options.reverse === true) ? 'cancel-btn' : 'ok-btn'
        },
        leftBtnFocus() {
            return (this.options.reverse === true)
        },
        rightBtnFocus() {
            return (this.options.reverse === false)
        },
        leftBtnText() {
            return this.options.reverse ? this.options.okText : this.options.cancelText
        },
        rightBtnText() {
            return this.options.reverse ? this.options.cancelText : this.options.okText
        }
    },
    methods: {
        clickRightBtn() {
            this.options.reverse ? this.cancel() : this.proceed()
        },
        clickLeftBtn() {
            this.options.reverse ? this.proceed() : this.cancel()
        },
        proceed() {
            if (this.loaderEnabled) {
                this.switchLoadingState(true)
                this.options.promiseResolver({
                    close: this.close,
                    loading: this.switchLoadingState
                })
            } else {
                this.options.promiseResolver(true)
                this.close()
            }
        },
        cancel() {
            if (this.loading === true)
                return
            this.close()
        },
        switchLoadingState(loading = null) {
            if (loading === null) {
                loading = !this.loading
            }

            this.loading = !!loading
        },
        close() {
            this.show = false
            this.closed = true
        },
        animationEnded(type) {
            this.endedAnimations.push(type)

            if (this.endedAnimations.indexOf('backdrop') !== -1 && this.endedAnimations.indexOf('content') !== -1) {
                this.options.promiseRejecter(false)
                this.$emit('close', this.options.id)
            }

        }
    },
    beforeDestroy() {
        if (this.closed === false) {
            this.cancelBtnDisabled ? this.proceed() : this.cancel()
        }
    },
    components: {
        CancelBtn,
        OkBtn
    }
}
</script>
