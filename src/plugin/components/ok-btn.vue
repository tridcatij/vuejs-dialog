<template>
    <button v-if="enabled" :class="['ui', 'button', 'positive', {'loading': loading}]"
            @click.prevent="proceed()" ref="btn" :disabled="is_disabled">
            <slot></slot>
    </button>
</template>

<script>
    import {DIALOG_TYPES, CONFIRM_TYPES, ANIMATION_TYPES} from '../js/constants'

    export default {
        data(){
            return {
                clicks_count: 0
            }
        },
        props: ['enabled', 'options', 'focus', 'loading'],
        mounted(){
            this.focus && this.$refs.btn.focus()
        },
        computed: {
            soft_confirm(){
                return (this.options.type === CONFIRM_TYPES.SOFT)
            },
            hard_confirm(){
                return (this.options.type === CONFIRM_TYPES.HARD)
            },
            is_disabled(){
                return (this.$parent.okBtnDisabled)
            },
            clicks_remaining(){
                return Math.max((this.options.clicksCount - this.clicks_count), 0)
            }
        },
        methods: {
            proceed(){
                if(!this.is_disabled && this.validateProceed()){
                    this.$emit('click')
                }
            },
            validateProceed(){
                switch (this.options.type){
                    case CONFIRM_TYPES.SOFT:
                        this.clicks_count++
                        return (this.clicks_count >= this.options.clicksCount)
                        break;
                    case CONFIRM_TYPES.BASIC:
                    default:
                        return true;
                }
            },
        }
    }
</script>