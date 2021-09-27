<script lang="ts">
import { defineComponent, PropOptions } from '@nuxtjs/composition-api'
import { Column } from '@/types/table'

export default defineComponent({
  props: {
    columns: {
      type: Array,
      required: true
    } as PropOptions<Column[]>,
    rows: {
      type: Array,
      required: true
    } as PropOptions<Array<Object>>
  },
  setup() {
    
  },
})
</script>

<template>
  <tbody>
    <tr
      v-for="row in rows"
      :key="`${row.date}-${row.name}`">
      <td
        v-for="column in columns"
        :key="column.label">
        <slot :name="column.label" :row="row">
          {{ row[column.key] }}
        </slot>
      </td>
    </tr>
  </tbody>
</template>
