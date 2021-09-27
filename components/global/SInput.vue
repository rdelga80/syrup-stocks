<script lang="ts">
import { computed, defineComponent, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    value: [String || Number]
  },

  setup: props => ({
    inputProps: reactive({
      type: computed(() => props.type),
      placeholder: computed(() => props.placeholder),
      value: computed(() => props.value)
    })
  })
})
</script>

<template>
  <input
    class="input"
    v-bind="inputProps"
    @blur="$emit('blur', $event.target.value)"
    @input="$emit('input', $event.target.value)" />
</template>

<style lang="scss" scoped>
.input {
  border-radius: 5px;
  padding: 3px 5px;
  outline: none;
  transition: all 200ms;

  &:focus {
    border: 1px inset var(--purple);
    box-shadow: 2px 2px 3px rgba(184, 22, 199, 0.3);
    transition: all 200ms;
  }
}

[placeholder] {
  font-family: var(--reg-font);
}
</style>
