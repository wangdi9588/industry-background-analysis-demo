export const benchMarkList = [
  { label: '高新技术企业数量(家)', key: 'highTechEnterprisesCount' },
  { label: '规模以上企业数量(家)', key: 'scaleAboveEnterprisesCount' },
  { label: '国家级专精特新“小巨人”企业(家)', key: 'nationalLittleGiantsEnterprisesCount' },
  { label: '企业整体数量(保定五产业统计口径)', key: 'totalEnterprisesCount' },
  { label: '主导产业总产值(亿元)', key: 'mainIndustryTotalOutput' },
  { label: '上市企业数量(家)', key: 'listedEnterprisesCount' },
  { label: '上市企业市值', key: 'listedEnterprisesMarketValue' },
  { label: '2025年超百亿元企业(家)', key: 'overTenBillionEnterprisesCountBy2025' },
  { label: '2025年产值目标', key: 'outputTargetBy2025' }
]

export const cityBenchMarkDatas = [
  {
    benchCityName: '城市一',
    highTechEnterprisesCount: 150,
    scaleAboveEnterprisesCount: 320,
    nationalLittleGiantsEnterprisesCount: 25,
    totalEnterprisesCount: 1800,
    mainIndustryTotalOutput: 450.5,
    listedEnterprisesCount: 12,
    listedEnterprisesMarketValue: 2800,
    overTenBillionEnterprisesCountBy2025: 8,
    outputTargetBy2025: 1200
  },
  {
    benchCityName: '城市二',
    highTechEnterprisesCount: 210,
    scaleAboveEnterprisesCount: 400,
    nationalLittleGiantsEnterprisesCount: 30,
    totalEnterprisesCount: 2200,
    mainIndustryTotalOutput: 600.8,
    listedEnterprisesCount: 15,
    listedEnterprisesMarketValue: 3500,
    overTenBillionEnterprisesCountBy2025: 10,
    outputTargetBy2025: 1500
  },
  {
    benchCityName: '城市三',
    highTechEnterprisesCount: 180,
    scaleAboveEnterprisesCount: 350,
    nationalLittleGiantsEnterprisesCount: 28,
    totalEnterprisesCount: 2000,
    mainIndustryTotalOutput: 520.3,
    listedEnterprisesCount: 14,
    listedEnterprisesMarketValue: 3100,
    overTenBillionEnterprisesCountBy2025: 9,
    outputTargetBy2025: 1350
  }
  // {
  //   benchCityName: '城市四',
  //   highTechEnterprisesCount: 190,
  //   scaleAboveEnterprisesCount: 380,
  //   nationalLittleGiantsEnterprisesCount: 27,
  //   totalEnterprisesCount: 2100,
  //   mainIndustryTotalOutput: 580.6,
  //   listedEnterprisesCount: 13,
  //   listedEnterprisesMarketValue: 3300,
  //   overTenBillionEnterprisesCountBy2025: 11,
  //   outputTargetBy2025: 1400
  // }
]

export const benchKeyMaxInfos = benchMarkList.reduce((obj, item) => {
  let maxValue = 0,
    maxCityName = ''
  cityBenchMarkDatas.forEach((ele) => {
    const value = ele[item.key as keyof typeof ele] as number
    if (maxValue < value) {
      maxValue = value
      maxCityName = ele.benchCityName
    }
  })

  obj[item.key] = {
    maxValue,
    maxCityName
  }
  return obj
}, {})
console.log('🚀 ~ benchKeyMaxInfos:', benchKeyMaxInfos)
