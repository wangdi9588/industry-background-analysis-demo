<template>
  <div class="summary-component-wrapper">
    <div class="innovation-entities-content"></div>
    <div class="summary-component-right-content">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import technicalMap from './technicalMap/technicalMap.vue'
import cooperativeRelation from './cooperativeRelation/cooperativeRelation.vue'
import innovationSubject from './innovationSubject/innovationSubject.vue'

const componentsMap = {
  innovationSubject: innovationSubject,
  technicalMap: technicalMap,
  cooperativeRelation: cooperativeRelation
}
const props = withDefaults(defineProps<{ componentKey: string }>(), {})

const activeComponent = computed(() => {
  return componentsMap[props.componentKey as keyof typeof componentsMap]
})
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
    border: 1px solid rgba(21, 184, 255, 0.5);
  }

  .summary-component-right-content {
    width: 0;
    flex: 1;
    height: 100%;
  }
}
</style>
