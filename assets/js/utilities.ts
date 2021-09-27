import Papa from 'papaparse'
import { camelCase, cloneDeep, map, zipObject } from 'lodash'
import { FormattedData } from '@/types/data'

/**
 * Convert csv nested string arrays to array of key-item object
 */
export const convertDataToObjects = (data: string[][]): FormattedData[] | undefined => {
  const clonedData = cloneDeep(data)

  const dataColumns = clonedData?.splice(0, 1)[0]

  return clonedData?.map((eachRow: string[]): FormattedData => {
    const zippedObject = zipObject(map(dataColumns, camelCase), eachRow) as FormattedData

    // Cases value to Number (if a number) for sorting purposes
    for (const key in zippedObject) {
      zippedObject[key] = Number(zippedObject[key]) || zippedObject[key]
    }

    return zippedObject
  })
}

export const downloadCsv = (data: FormattedData[]) => {
  const csv = Papa.unparse(data)

  const csvURL = window.URL.createObjectURL(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  )

  window.open(csvURL)
}

/**
 * Formats date strings to local date
 */
export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString()

/**
 * Formats number
 */
export const formatNumber = (
  value: number,
  currency: boolean = false
): string => new Intl.NumberFormat(
  'en-US', currency
    ? { style: currency ? 'currency' : 'unit', currency: 'USD' }
    : {}
).format(value)
