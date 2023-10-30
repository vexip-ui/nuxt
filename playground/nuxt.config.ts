import vexipUI from '../src/module'

const vxpStylePresetRE = /vexip-ui\/style(?:\/dark)?\/preset/

export default defineNuxtConfig({
  modules: [vexipUI],
  vexipUI: {
    importStyle: 'sass',
    importDarkTheme: true
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (code: string, path: string) => {
            return vxpStylePresetRE.test(path)
              ? code.replace('@use \'./design/variables.scss\' as *;', '@use \'@/style/variables.scss\' as *;')
              : code
          }
        }
      }
    }
  }
})
