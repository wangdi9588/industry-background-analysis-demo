<template>
  <div class="policy-bench-wrapper">
    <div class="policy-type-tabs">
      <div
        :class="['policy-type-tab', { 'policy-type-tab-active': activePolicyType === item.key }]"
        v-for="item in policyTypeTabs"
        :key="item.key"
        @click="switchPolicyType(item.key)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="bench-mark-items">
      <div v-for="ele in policyBenchData" :key="ele.city" class="bench-mark-item">
        <p class="bench-title">{{ ele.city }}</p>
        <div class="table-header">
          <span>政府扶持对象</span>
          <span>最高扶持补贴金额</span>
        </div>
        <div class="bench-value-items">
          <div v-for="item in ele.policies" :key="item.label" :class="['bench-value-item']">
            <div class="bench-value-item-label">
              <n-ellipsis>{{ item.label }}</n-ellipsis>
            </div>
            <span class="bench-value-item-value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { policyBenchData } from './mock'
const policyTypeTabs = [
  { label: '创新补助', key: 'innovation_subsidy' },
  { label: '企业补助', key: 'enterprise_subsidy' },
  { label: '数字化', key: 'digitalization' },
  { label: '人才补助', key: 'talent_subsidy' },
  { label: '金融信贷', key: 'financial_credit' },
  { label: '项目补助', key: 'project_subsidy' },
  { label: '产出补助', key: 'output_subsidy' },
  { label: '服务补助', key: 'service_subsidy' }
]

const activePolicyType = ref('innovation_subsidy')

function switchPolicyType(key: string) {
  if (activePolicyType.value === key) return
  activePolicyType.value = key
}
</script>

<style scoped lang="less">
.policy-bench-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  gap: 8px;
  .policy-type-tabs {
    width: 52px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .policy-type-tab {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 0;
      flex: 1;
      padding: 0 20px;
      font-size: 16px;
      color: #89adcb;
      font-weight: 700;
      line-height: 22px;
      background: linear-gradient(
        139deg,
        rgba(95, 178, 255, 0.1) 0%,
        rgba(95, 168, 255, 0.16) 61%,
        rgba(95, 204, 255, 0.32) 83%,
        rgba(69, 132, 242, 0.24) 100%
      );

      &.policy-type-tab-active {
        color: #fff;
        background: linear-gradient(143deg, #0b57a6 0%, #0170ab 100%);
      }
    }
  }

  .bench-mark-item {
    width: 438px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.2);

    flex-shrink: 0;

    display: flex;
    flex-direction: column;

    .bench-title {
      height: 90px;
      line-height: 90px;
      width: 100%;
      color: #fff;
      text-align: center;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 26px;
      margin: 0px auto;
      white-space: nowrap;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0 12px;
      color: #cceeff;
      font-size: 20px;
    }

    .bench-value-items {
      padding-top: 16px;
      width: 100%;
      height: 0;
      flex: 1;
      overflow-y: auto;
    }
    .bench-value-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0px 12px;
      margin-bottom: 10px;
      height: 64px;
      padding-left: 20px;
      font-size: 22px;
      font-weight: bold;
      color: #cceeff;
      background: linear-gradient(
        139deg,
        rgba(95, 178, 255, 0.1) 0%,
        rgba(95, 168, 255, 0.16) 61%,
        rgba(95, 204, 255, 0.32) 83%,
        rgba(69, 132, 242, 0.24) 100%
      );
    }

    .bench-value-item-label {
      color: #fff;
      width: 0;
      flex: 1;
    }
    .bench-value-item-value {
      font-size: 22px;
      line-height: 64px;
      font-family: DingTalkSans;
      font-weight: 700;
      color: #14fffe;
    }
  }

  .bench-mark-items {
    width: 0;
    flex: 1;
    height: 100%;
    display: flex;
    gap: 8px;
  }
}
</style>
