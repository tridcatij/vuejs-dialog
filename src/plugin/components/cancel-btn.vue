<template>
    <button v-if="enabled" :class="['ui', 'button', 'negative']"
            @click.prevent="$emit('click')" ref="btn">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        props: ['enabled', 'options', 'focus', 'loading'],
        mounted(){
            this.focus && this.$refs.btn.focus()
        }
    }
</script>