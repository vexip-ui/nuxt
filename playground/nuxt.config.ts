// import { fileURLToPath } from 'node:url'
import vexipUI from '../src/module'

export default defineNuxtConfig({
  // alias: {
  //   'vexip-ui': fileURLToPath(new URL('../../..', import.meta.url)),
  //   '@vexip-ui/icons': fileURLToPath(new URL('../../icons/dist/index', import.meta.url))
  // },
  modules: [vexipUI],
  vexipUI: {}
})
