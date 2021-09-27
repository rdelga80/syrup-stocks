import { formatDate, formatNumber } from '@/assets/js/utilities'

import {
  FormattedAggregatedStockExchange,
  StockData,
  StockDataResponse
} from '@/types/data'

/**
 * Maps stock data for table
 */
 export const mapStockData = (stockDataResponse: StockDataResponse[]): StockData[] =>
 stockDataResponse.map((dataItem: StockDataResponse): StockData => ({
   closePrice: formatNumber(Number(dataItem.close_price), true) || '',
   date: dataItem.date?.toLocaleDateString() || '',
   name: dataItem.name || '',
   highPrice: formatNumber(Number(dataItem.high_price), true) || '',
   lowPrice: formatNumber(Number(dataItem.low_price), true) || '',
   market: String(dataItem.market) || '',
   openPrice: formatNumber(Number(dataItem.open_price), true) || '',
   volume: formatNumber(Number(dataItem.volume)) || ''
 }))

/**
* Maps aggregated stock exchange data
*/
export const mapAggregatedStockExchangeData = (formattedData: FormattedAggregatedStockExchange[]): FormattedAggregatedStockExchange[] =>
 formattedData.map(dataItem => ({
   date: new Date(dataItem.date).toLocaleDateString() || '',
   totalRev: Number(dataItem.totalRev) || 0,
   totalVol: Number(dataItem.totalVol) || 0
 }))