<script lang="ts">
import { computed, defineComponent, PropOptions } from '@nuxtjs/composition-api'
import { Column } from '@/types/table'
import SButton from '~global/SButton.vue'

export default defineComponent({
  components: { SButton },
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => []
    } as PropOptions<Column[]>,
    isLastRecord: Boolean,
    loading: Boolean,
    notClickableHeader: Boolean,
    selected: {
      type: String
    },
    showFooter: Boolean
  },
  setup: (props, { emit }) => ({
    columnsLength: computed(() => props.columns!.length),
    disableLoadMore: computed(() => props.isLastRecord && props.loading),
    handleHeaderClick: (columnKey: string) => props.notClickableHeader ?? emit('select', columnKey),
    headerClasses: (columnKey: string) => ({
      header: true,
      clickable: !props.notClickableHeader,
      selected: props.selected === columnKey
    })
  })
})
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <td
          v-for="column in columns"
          :key="column.key"
          :class="headerClasses(column.key)"
          @click="handleHeaderClick(column.key)">
          <slot :name="column.key" :column="column">
            {{ column.label }}
          </slot>
        </td>
      </tr>
    </thead>

    <slot />

    <tfoot v-if="showFooter">
      <tr class="footer-row">
        <slot name="footer">
          <td class="footer-cell" :colspan="columnsLength">
            <SButton
              block
              class="loading-button"
              :disabled="disableLoadMore"
              @click="$emit('load-more')">
              {{ loading ? 'Loading...' : 'Load More Records' }}
            </SButton>
          </td>
        </slot>
      </tr>
    </tfoot>
  </table>
</template>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}

.table {
  border-spacing: 1rem;
  padding: 1.25rem;
}

.header {
  font-size: var(--font-size-sm);
  border-bottom: 2px dashed white;
}

.selected {
  color: var(--purple);
}

.footer-row {
  text-align: center;
}

.loading-button {
  margin-bottom: 2rem;
}
</style>
