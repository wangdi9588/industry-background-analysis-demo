/**
 * @description: 数字*100 转为%，输出数字格式，%单位另带，规则 >0且<0.01的 按0.01算，<0且>-0.01的 按 -0.01算
 * @param {number} num
 * @param {2} fixed
 * @return {*}
 */
export function numberToPrecentFixed(num: number, type = 'precent', fixed = 2): number {
  const multip = type === 'precent' ? 100 : 1
  const percentNum = num * multip
  if (percentNum > 0 && percentNum < 0.01) {
    return 0.01
  } else if (percentNum < 0 && percentNum > -0.01) {
    return -0.01
  } else {
    return Number(percentNum.toFixed(fixed))
  }
}

/**
 * @description: 数字带 + - 号
 * @param {number} num
 * @param {2} fixed
 * @return {*}
 */
export function getNumSymbol(num: number, fixed = 2): string {
  const symb = num > 0 ? '+' : ''
  return `${symb}${num.toFixed(fixed)}`
}

/**
 * @description: naive-ui   Number Animation precision
 * @param {number} num
 * @param {*} precision
 * @return {*}
 */
export function getNumPrecision(num: number | string, precision = 2) {
  const processedNum = Number.parseFloat(`${num}`)
  // 如果num为0 undefined null  或者 num为整数 则 返回0
  if (!processedNum || Number.isInteger(processedNum)) return 0
  const precisionNum = Number.parseFloat(processedNum.toFixed(precision))
  const numSplitArr = String.prototype.split.call(precisionNum, '.')
  const fractionalPartValue = numSplitArr[1]
  if (!fractionalPartValue) return 0
  return fractionalPartValue.length
}
