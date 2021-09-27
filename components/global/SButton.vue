<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SButton',
  props: {
    block: Boolean,
    disabled: Boolean
  },
  setup: props => ({
    buttonClasses: computed(() => ({
      block: props.block,
      button: true,
      disabled: props.disabled
    }))
  })
})
</script>

<template>
  <button :class="buttonClasses" @click="$emit('click')">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
%button-vars {
  --btn-background: white;
  --btn-primary-color: var(--purple);
  --btn-border-color: var(--btn-primary-color);
  --btn-cursor: pointer;
  --btn-width: unset;

  &:hover {
    --btn-primary-color: white;
  }
}

.block {
  --btn-width: 100%;
}

.disabled {
  --btn-background: var(--gray);
  --btn-border-color: var(--gray-dark);
  --btn-cursor: not-allowed;
}

.button {
  @extend %button-vars;

  background: var(--btn-background);
  border: 2px solid var(--btn-border-color);
  border-radius: 5px;
  color: var(--btn-primary-color);
  cursor: var(--btn-cursor);
  font-family: var(--reg-font);
  font-size: var(--font-size-md);
  font-weight: 600;
  padding: 0.8em 1.15em;
  text-transform: uppercase;
  transition: all 500ms;
  width: var(--btn-width);

  &:hover {
    box-shadow: inset 0 -100px 0 0 var(--purple);
    transition: all 500ms;
  }
}
</style>
