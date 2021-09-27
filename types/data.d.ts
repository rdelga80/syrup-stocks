type StockExchangeKeys = 'date' | 'totalRev' | 'totalVol'
type StockExchangeKeysResponse = 'date' | 'total_rev' | 'total_vol'

type StockDataKeys = 'name' | 'date' | 'openPrice' | 'closePrice' | 'highPrice' | 'lowPrice' | 'volume' | 'market'

export interface StockDataResponse {
  close_price: number
  date: Date,
  high_price: number
  low_price: number
  name: string,
  market: string
  open_price: number
  volume: number
}

export interface StockData {
  closePrice: string
  date: string,
  highPrice: string
  lowPrice: string
  name: string,
  market: string
  openPrice: string
  volume: string
}

export type FormattedStockData = Record<StockDataKeys, string | number>

export type FormattedAggregatedStockExchange = Record<StockExchangeKeys, string | number>

export type FormattedData = FormattedAggregatedStockExchange | FormattedStockData

export interface Sorting {
  key: string
  order: string
}
