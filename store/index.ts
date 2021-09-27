import { ActionContext } from 'vuex'

import * as d3 from 'd3'
import Papa from 'papaparse'

import {
  camelCase,
  filter,
  map,
  orderBy,
  snakeCase,
  startCase
} from 'lodash'
import { mapStockData } from '@/assets/js/mappers'

import { Column } from '@/types/table'
import { Sorting, StockData, StockDataResponse } from '@/types/data'

const RECORDS_PER_PAGE = 100

type DataSource = 'aggregatedStockExchange' | 'stockData'

export interface State {
  data: {
    aggregatedStockExchange?: Object[]
    stockData?: StockDataResponse[]
  }
  loading: {
    aggregatedStockExchange: boolean
    isInitialStockDataLoad: boolean
    stockData: boolean
  }
  ordering: {
    stockData: {
      key: string
      order: 'desc' | 'asc',
      filterName?: string,
      page: number
    }
  }
}

export const defaultState: State = {
  data: {
    aggregatedStockExchange: [],
    stockData: []
  },
  loading: {
    aggregatedStockExchange: false,
    isInitialStockDataLoad: true,
    stockData: false
  },
  ordering: {
    stockData: {
      key: 'date',
      order: 'asc',
      filterName: undefined,
      page: 1
    }
  }
}

export const state = (): State => ({ ...defaultState })

export const getters = {
  /**
   * Gets stock data table columns
   */
  getStockDataColumns: ({ data: { stockData } }: State): Column[] =>
    Object.keys(stockData?.[0] || {})?.map(dataItem => ({
      key: camelCase(dataItem),
      label: startCase(dataItem)
    })) || [],
  /**
   * Gets stock data sorting key and order
   */
  getStockDataSort: ({ ordering }): Sorting => ({
    key: camelCase(ordering.stockData.key),
    order: ordering.stockData.order
  }),
  /**
   * Gets stock data formatted as object key-item pair
   */
  getStockDataFormatted: ({ data: { stockData } }: State): StockData[] =>
    mapStockData(
      stockData || []
    )
}

export const actions = {
  /**
   * Fetches, parses, and sets Aggregated Stock Exchange Data
   */
  fetchAggregatedStockExchange: ({ commit }: ActionContext<State, State>): void => {
    commit('SET_LOADING', { dataSource: 'aggregatedStockExchange', loading: true })

    d3.csv('/aggregated_stock_exchange.csv').then((data) => {
      commit('SET_LOADING', { dataSource: 'aggregatedStockExchange', loading: false })
      return commit('SET_DATA_ITEM', { item: 'aggregatedStockExchange', value: data })
    })
  },
  /**
   * Fetches, parses, and sets Stock Data
   */
  fetchStockData: ({ commit, state }: ActionContext<State, State>): void => {
    commit('SET_LOADING', { dataSource: 'stockData', loading: true })

    return Papa.parse('/stock_data.csv', {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: ({ data }: { data: StockDataResponse[] }) => {
        const orderedData = orderBy(
          map(
            filter(data, (item: StockDataResponse) => state.ordering.stockData.filterName
              ? item.name === state.ordering.stockData.filterName
              : item.name
            ),
            (item: StockDataResponse) => ({
              ...item,
              date: new Date(item.date)
            })
          ),
          [state.ordering.stockData.key],
          [state.ordering.stockData.order]
        )

        commit('SET_DATA_ITEM', {
          item: 'stockData',
          value: orderedData.slice(
            state.ordering.stockData.page > 1
              ? ((state.ordering.stockData.page - 1) * RECORDS_PER_PAGE) + 1
              : 0,
            state.ordering.stockData.page * RECORDS_PER_PAGE
          )
        })

        commit('SET_LOADING', { dataSource: 'stockData', loading: false })
        commit('SET_LOADING', { dataSource: 'isInitialStockDataLoad', loading: false })
      }
    })
  },
  /**
   * Resets specific data source
   */
  resetDataSource: (
    { commit }: ActionContext<State, State>,
    dataSource: DataSource
  ): void =>
    commit('RESET_DATA', dataSource),
  /**
   * Sets page for data nav
   */
  setDataPage: (
    { commit }: ActionContext<State, State>,
    { dataSource, page }: { dataSource: DataSource, page: number }
  ): void =>
    commit('SET_DATA_PAGE', { dataSource, page }),
  /**
   * Sets data source's sort
   */
  setColumnSort: (
    { commit, state }: ActionContext<State, State>,
    { columnHeader, key }: { columnHeader: string, key: string }
  ): void =>
    commit(
      'SET_HEADER_COLUMN',
      {
        type: columnHeader,
        key: snakeCase(key),
        order: state.ordering[columnHeader].key !== snakeCase(key) ||
          state.ordering[columnHeader].order === 'desc'
          ? 'asc'
          : 'desc'
      }
    ),
  /**
   * Sets value for data filter by data source
   */
  setFilterValue: (
    { commit }: ActionContext<State, State>,
    { dataSource, value }: { dataSource: DataSource, value: string }
  ): void => commit(
    'SET_FILTER_VALUE',
    { dataSource, value }
  ),
  /**
   * Sets loading values
   */
  setLoading: (
    { commit }: ActionContext<State, State>,
    { loadingType, isLoading }: { loadingType: string, isLoading: boolean }
  ): void =>
    commit('SET_LOADING', { dataSource: loadingType, loading: isLoading })
}

export const mutations = {
  /**
   * Resets data item
   */
  RESET_DATA (state: State, dataSource: DataSource): void {
    state.data[dataSource] = []
  },
  /**
   * Sets simple data items in state
   */
  SET_DATA_ITEM (
    state: State,
    { item, value }: { item: string, value: StockDataResponse[] }
  ) {
    state.data[item] = [...state.data[item], ...value]
  },
  /**
   * Sets data page for nav
   */
  SET_DATA_PAGE (
    state: State,
    { dataSource, page }: { dataSource: DataSource, page: number }
  ) {
    state.ordering[dataSource].page = page
  },
  /**
   * Sets value of filter by data source
   */
  SET_FILTER_VALUE (
    state: State,
    { dataSource, value }: { dataSource: DataSource, value: string }
  ) {
    state.ordering[dataSource].filterName = value
  },
  /**
   * Sets header column
   */
  SET_HEADER_COLUMN (
    state: State,
    { type, key, order }: { type: DataSource, key: string, order?: 'asc' | 'desc' }
  ) {
    state.ordering[type].key = key
    state.ordering[type].order = order
  },
  /**
   * Sets loading value of data sources
   */
  SET_LOADING (
    state: State,
    { dataSource, loading }: { dataSource: DataSource, loading: boolean }
  ) {
    state.loading[dataSource] = loading
  }
}
