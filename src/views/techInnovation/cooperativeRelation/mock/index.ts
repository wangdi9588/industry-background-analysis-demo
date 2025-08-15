export const cooperationData = [
  { unitName: '河北邦泰氨纶科技有限公司', projectNum: 1, projectRate: '100%' },

  { unitName: '石家庄创新材料有限公司', projectNum: 3, projectRate: '75%' },
  { unitName: '唐山重工集团', projectNum: 2, projectRate: '50%' },
  { unitName: '邯郸科技研究院', projectNum: 1, projectRate: '25%' },
  { unitName: '沧州化工有限公司', projectNum: 4, projectRate: '80%' },
  { unitName: '邢台新能源开发公司', projectNum: 1, projectRate: '20%' },
  { unitName: '衡水环保技术中心', projectNum: 0, projectRate: '0%' },
  { unitName: '承德农业生态基地', projectNum: 2, projectRate: '40%' },
  { unitName: '张家口冰雪产业联盟', projectNum: 1, projectRate: '15%' },
  { unitName: '廊坊电子信息产业园', projectNum: 3, projectRate: '60%' },
  { unitName: '秦皇岛海洋生物科技', projectNum: 0, projectRate: '0%' },
  { unitName: '河北科技大学产学研中心', projectNum: 5, projectRate: '90%' },
  { unitName: '保定高新技术开发区', projectNum: 2, projectRate: '30%' },
  { unitName: '河北医药集团', projectNum: 1, projectRate: '10%' },
  { unitName: '石家庄物流枢纽', projectNum: 0, projectRate: '0%' },
  { unitName: '雄安新区建设委员会', projectNum: 6, projectRate: '95%' },
  { unitName: '河北金融投资公司', projectNum: 1, projectRate: '5%' },
  { unitName: '燕山大学技术转移中心', projectNum: 2, projectRate: '35%' }
]

export const industryTrendData = [
  { name: '电子信息产业', value: 478 },
  { name: '装备制造业', value: 389 },
  { name: '食品饮料产业', value: 342 },
  { name: '能源化工产业', value: 412 },
  { name: '生物医药产业', value: 298 },
  { name: '新材料产业', value: 356 },
  { name: '汽车制造产业', value: 423 },
  { name: '纺织服装产业', value: 187 },
  { name: '文化旅游产业', value: 265 },
  { name: '现代物流产业', value: 321 },
  { name: '数字经济产业', value: 456 },
  { name: '绿色能源产业', value: 376 },
  { name: '航空航天产业', value: 401 },
  { name: '现代农业产业', value: 234 },
  { name: '金融服务业', value: 432 }
]

export const companyCooperationRelationChartData = [
  // 1. 技术研发类合作
  {
    source: '华为',
    target: '宁德时代',
    value: 80, // 合作强度 (0-100)
    category: '技术研发',
    projects: ['动力电池管理', '快充技术'],
    startDate: '2022-03'
  },
  {
    source: '华为',
    target: '中芯国际',
    value: 75,
    category: '芯片制造',
    projects: ['14nm工艺优化', '封装技术'],
    startDate: '2021-11'
  },

  // 2. 战略投资类合作
  {
    source: '华为',
    target: '比亚迪',
    value: 65,
    category: '战略投资',
    projects: ['智能汽车平台'],
    startDate: '2023-01'
  },

  // 3. 云计算与AI合作
  {
    source: '华为',
    target: '科大讯飞',
    value: 70,
    category: '人工智能',
    projects: ['语音识别联合实验室'],
    startDate: '2020-07'
  },
  {
    source: '华为',
    target: '用友网络',
    value: 60,
    category: '企业云服务',
    projects: ['ERP系统迁移'],
    startDate: '2023-05'
  },

  // 4. 海外合作伙伴
  {
    source: '华为',
    target: '西门子',
    value: 55,
    category: '工业4.0',
    projects: ['5G智慧工厂'],
    startDate: '2022-09'
  },
  {
    source: '华为',
    target: '奔驰',
    value: 50,
    category: '智能座舱',
    projects: ['鸿蒙车机系统'],
    startDate: '2023-04'
  }
]
