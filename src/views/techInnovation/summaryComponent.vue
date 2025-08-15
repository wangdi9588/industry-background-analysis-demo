<template>
  <div class="summary-component-wrapper">
    <div class="innovation-entities-content">
      <TitleWithInput title="创新主体列表" placeholder="请输入关键词"></TitleWithInput>
      <div class="tab-options">
        <div
          v-for="item in innovationTypeOptions"
          :key="item.key"
          :class="['tab-option-item', { 'tab-option-item-active': activeInnovationType === item.key }]"
          @click="checkActiveType(item.key)"
        >
          <p>{{ item.label }}</p>
          <div>
            <span>{{ item.value }}</span>
            <span>{{ item.unit }}</span>
          </div>
        </div>
      </div>
      <div class="innovation-list-content">
        <div
          v-for="(item, index) in activeInnovationList"
          :key="index"
          :class="['innovation-card-item', { 'innovation-card-item-active': selectedCompanyName === item.name }]"
          @click="handleSwitchCompany(item)"
        >
          <div class="innovation-card-item-name">
            <n-ellipsis>{{ item.name }}</n-ellipsis>
          </div>
          <span v-if="item.innovationOrg" :class="['innovation-card-item-tag', `innovation-card-item-tag-${activeInnovationType}`]">
            {{ item.innovationOrg }}
          </span>
        </div>
      </div>
    </div>
    <div class="summary-component-right-content">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import technicalMap from './technicalMap/technicalMap.vue'
import cooperativeRelation from './cooperativeRelation/cooperativeRelation.vue'
import innovationSubject from './innovationSubject/innovationSubject.vue'
import TitleWithInput from '@/components/common/CardContent/TitleWithInput.vue'
import { highTechCompanies, innovativeOrganizations } from './mock'

const componentsMap = {
  innovationSubject: innovationSubject,
  technicalMap: technicalMap,
  cooperativeRelation: cooperativeRelation
}
const props = withDefaults(defineProps<{ componentKey: string }>(), {})

const activeComponent = computed(() => {
  return componentsMap[props.componentKey as keyof typeof componentsMap]
})

const innovationTypeOptions = ref([
  {
    label: '高新技术企业',
    key: 'highTechEnterprise',
    value: 0,
    unit: '家'
  },
  {
    label: '创新机构',
    key: 'innovationInstitution',
    value: 0,
    unit: '家'
  }
])

const activeInnovationType = ref('highTechEnterprise')

function checkActiveType(key: string) {
  activeInnovationType.value = key
}

const activeInnovationList = computed(() => {
  return activeInnovationType.value === 'highTechEnterprise' ? highTechCompanies : innovativeOrganizations
})

const selectedCompanyName = ref('')

function handleSwitchCompany(item: { name: string }) {
  selectedCompanyName.value = item.name
}

watch(
  activeInnovationList,
  () => {
    const [firstItem] = activeInnovationList.value
    selectedCompanyName.value = firstItem?.name ?? ''
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style scoped lang="less">
.summary-component-wrapper {
  width: 100%;
  height: 100%;

  display: flex;

  gap: 12px;

  .innovation-entities-content {
    width: 418px;
    height: 100%;
    padding: 10px 0;
    border: 1px solid rgba(21, 184, 255, 0.5);

    display: flex;
    flex-direction: column;

    .tab-options {
      display: flex;
      justify-content: space-evenly;
      margin: 8px 0;

      .tab-option-item {
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.08);
        cursor: pointer;

        &.tab-option-item-active {
          color: #23e5ff;
          border: 1px solid #23e5ff;
        }
      }
    }

    .innovation-list-content {
      width: 100%;
      height: 0;
      flex: 1;
      overflow-y: auto;

      .innovation-card-item {
        padding: 18px;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        background-color: rgba(31, 153, 255, 0.2);
        cursor: pointer;
        &:not(:last-child) {
          margin-bottom: 2px;
        }
        &.innovation-card-item-active,
        &:hover {
          background-color: rgba(31, 153, 255, 0.6);
        }

        .innovation-card-item-name {
          font-size: 16px;
          color: #fff;
          border-radius: 2px;
        }
        .innovation-card-item-tag {
          padding: 8px 18px;
          text-align: center;
          &.innovation-card-item-tag-highTechEnterprise {
            background-color: rgba(255, 198, 76, 0.2);
            color: #ffc64c;
          }
          &.innovation-card-item-tag-innovationInstitution {
            background-color: rgba(21, 236, 255, 0.15);
            color: #15ecff;
          }
        }
      }
    }
  }

  .summary-component-right-content {
    width: 0;
    flex: 1;
    height: 100%;
  }
}
</style>
