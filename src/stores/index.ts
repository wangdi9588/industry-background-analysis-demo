export * from './useLoadingStore'
// export * from './useSpinStore'
export * from './useGlobalRequestControl'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
