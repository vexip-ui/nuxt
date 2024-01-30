import vexipUI from '../src/module'

export default defineNuxtConfig({
  modules: [vexipUI],
  vexipUI: {
    importStyle: 'sass',
    importDarkTheme: true,
    themeVarsPath: {
      base: '@/style/variables.scss',
      dark: '@/style/dark-variables.scss'
    }
  }
})
