import { defineStore } from 'pinia'

export type TIndustryOptionItem = { label: string; value: string | number }

export interface IGlobalIndustryOptionStore {
  industryOptions: TIndustryOptionItem[]
  activeIndustryInfo: Partial<TIndustryOptionItem>
  activeIndustryValue?: string | number
}

export const useGlobalIndustryOptionStore = defineStore('globalIndustryOptionStore', {
  state: (): IGlobalIndustryOptionStore => ({
    industryOptions: [],
    activeIndustryInfo: {},
    activeIndustryValue: ''
  }),
  actions: {
    updateIndustryOptions(options: TIndustryOptionItem[]) {
      this.industryOptions = options
    },
    updateActiveIndustryInfo(value: TIndustryOptionItem['value'], industryInfo: TIndustryOptionItem) {
      this.activeIndustryInfo = industryInfo
      this.activeIndustryValue = value
    }
  }
})
