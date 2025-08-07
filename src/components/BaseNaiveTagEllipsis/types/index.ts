export interface BaseNaiveTagEllipsisProps {
  originData: string | string[] | { [key: string]: string }[]
  separator?: string
  labelKey?: string
  colorKey?: string
  colorList?: { [key: string]: string[] }
}
