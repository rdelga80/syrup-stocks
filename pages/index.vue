<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  useStore
} from '@nuxtjs/composition-api'

import ArrowDown from '~icons/icons/arrow-down.vue'
import ArrowUp from '~icons/icons/arrow-up.vue'
import SButton from '~global/SButton.vue'
import SInput from '~global/SInput.vue'
import STable from '~global/STable/index.vue'
import STableRow from '~global/STable/STableRow.vue'

import {
  FormattedStockData
} from '@/types/data'
import { State } from '@/store/index'
import { downloadCsv } from '~/assets/js/utilities'

export default defineComponent({
  name: 'HomePage',
  components: {
    ArrowDown,
    ArrowUp,
    SButton,
    SInput,
    STable,
    STableRow
  },
  setup () {
    const { state, getters, dispatch } = useStore<State>()

    onBeforeMount(() => {
      /**
       * Fetch data items before mounting
       */
      dispatch('fetchAggregatedStockExchange')
      dispatch('fetchStockData')
    })

    /**
     * Fetches clean set of stock data
     */
    const fetchCleanStockData = async () => {
      await dispatch('setLoading', {
        loadingType: 'isInitialStockDataLoad',
        isLoading: true
      })
      await dispatch('resetDataSource', 'stockData')

      return dispatch('fetchStockData')
    }

    /**
     * Loads more records and appends to end of table
     */
    const loadMoreRecords = async () => {
      const nextPage = computed(() => state.ordering.stockData.page)

      try {
        await dispatch('setDataPage', {
          dataSource: 'stockData',
          page: nextPage.value + 1
        })

        return dispatch('fetchStockData')
      } catch (e) {
        console.trace(e)
      }
    }

    /**
     * Resets entered search value and refreshes table
     */
    const resetStockDataSearch = () => {
      fetchCleanStockData()

      updateStockName(undefined)
    }

    /**
     * Selects column for sorting and fetches data
     */
    const selectColumn = async (columnKey: string) => {
      try {
        await dispatch('setColumnSort', {
          columnHeader: 'stockData',
          key: columnKey
        })

        await dispatch('resetDataSource', 'stockData')

        return dispatch('fetchStockData')
      } catch (e) {
        console.trace(e)
      }
    }

    /**
     * Sets stock name search value
     */
    const updateStockName = (entered?: string) => dispatch(
      'setFilterValue',
      { dataSource: 'stockData', value: entered }
    )

    /** Bundled props for table */
    const loadingStockData = computed((): boolean => state.loading.stockData)
    const stockDataColumns = computed((): FormattedStockData[] => getters.getStockDataColumns)
    const stockDataSelectedColumn = computed(() => getters.getStockDataSort.key)

    const tableProps = reactive({
      loading: computed(() => loadingStockData.value),
      columns: computed(() => stockDataColumns.value),
      selected: computed(() => stockDataSelectedColumn.value)
    })

    return {
      downloadCsv: () => downloadCsv(getters.getStockDataFormatted),
      fetchCleanStockData,
      isInitialStockDataLoad: computed(() => state.loading.isInitialStockDataLoad),
      loadMoreRecords,
      loadingStockData,
      resetStockDataSearch,
      selectColumn,
      stockData: computed((): Object[] => getters.getStockDataFormatted),
      stockDataColumns,
      stockDataSelectedColumn,
      stockDataSelectedColumnDirection: computed(() => getters.getStockDataSort.order),
      stockName: computed(() => state.ordering.stockData.filterName),
      tableProps,
      updateStockName
    }
  }
})
</script>

<template>
  <article class="page">
    <header class="header">
      <h1 class="title drop-shadow">
        Syrup Stocks
      </h1>
    </header>

    <section class="actions">
      <SInput
        class="name-input"
        :value="stockName"
        placeholder="Stock name..."
        @input="updateStockName" />

      <SButton block @click="fetchCleanStockData">
        Search
      </SButton>

      <SButton block @click="resetStockDataSearch">
        Reset
      </SButton>

      <SButton block @click="downloadCsv">
        Download
      </SButton>
    </section>

    <section class="stock-table">
      <STable
        v-if="!isInitialStockDataLoad"
        class="table"
        v-bind="tableProps"
        show-footer
        @load-more="loadMoreRecords">
        <template
          v-for="column in stockDataColumns"
          #[column.key]="{ column }">
          <div
            :key="column.key"
            class="column-header"
            @click="selectColumn(column.key)">
            {{ column.label }}

            <template v-if="column.key === stockDataSelectedColumn">
              <ArrowUp
                v-if="stockDataSelectedColumnDirection === 'asc'"
                :key="`${column.name}-asc`"
                class="icon" />

              <ArrowDown
                v-else
                :key="`${column.name}-desc`"
                class="icon" />
            </template>
          </div>
        </template>
        <STableRow :columns="stockDataColumns" :rows="stockData" />
      </STable>

      <div v-else class="loading-data">
        Loading Data...
      </div>
    </section>
  </article>
</template>

<style lang="scss" scoped>
.column-header {
  align-items: center;
  cursor: pointer;
  display: flex;
}

.page {
  display: grid;
  overflow: hidden;
  place-content: flex-start center;
  height: 100vh;
  margin: 2em 2em 0;
}

.header {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.title {
  color: white;
  font-size: 9em;
}

.actions {
  column-gap: 8px;
  display: flex;
  margin-bottom: 1.5rem;
}

.name-input {
  flex: 1 0 calc(50% - 30px);
}

.icon {
  fill: white;
}

.stock-table {
  background: black;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  color: white;
  display: flex;
  height: auto;
  justify-content: center;
  margin-bottom: 2em;
  overflow: hidden scroll;
  width: 100%;
}

.loading-data {
  padding: 2rem;
}
</style>
