import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig
} from '@nuxt/kit'
import { queryBaseStyles, queryImports, queryVersion } from './resolver'
import { transform } from './transform'
import { compare } from 'compare-versions'
import { isNull, toCapitalCase } from '@vexip-ui/utils'

import type { ModuleOptions } from './types'

const iconFirstNumberRE = /^I[0-9].*/

const libPlugins = [
  'Confirm',
  'Contextmenu',
  'Loading',
  'Message',
  'Notice',
  'Toast'
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vexip-ui',
    configKey: 'vexipUI',
    compatibility: {
      nuxt: '>=3.0.0'
    }
  },
  defaults: {
    include: [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.((c|m)?j|t)sx?$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    importStyle: true,
    importDarkTheme: false,
    fullStyle: undefined,
    themeVarsPath: {},
    prefix: 'V',
    directives: true,
    resolveIcon: true,
    iconPrefix: ''
  },
  setup(options, nuxt) {
    if (isNull(options.fullStyle) && nuxt.options.dev) {
      options.fullStyle = true
    }

    const version = queryVersion()
    const imports = queryImports()
    const prefix = toCapitalCase(options.prefix || '')
    const iconPrefix = isNull(options.iconPrefix)
      ? prefix
      : toCapitalCase(options.iconPrefix)

    nuxt.options.css.push(...queryBaseStyles(options))

    if (nuxt.options.components !== false) {
      for (const component of imports.components) {
        addComponent({
          export: component,
          name: `${prefix}${component}`,
          filePath: 'vexip-ui'
        })
      }

      if (options.resolveIcon) {
        for (const icon of imports.icons) {
          addComponent({
            export: icon,
            name: `${iconPrefix}${
              iconFirstNumberRE.test(icon) ? icon : `I${icon}`
            }`,
            filePath: '@vexip-ui/icons'
          })
        }
      }
    }

    if (nuxt.options.imports.autoImport !== false) {
      const { resolve } = createResolver(import.meta.url)

      addPlugin(resolve('./runtime/plugin'))
      addImportsSources({
        from: 'vexip-ui',
        imports: libPlugins.map((plugin) => [plugin, `${prefix}${plugin}`])
      })

      if (options.resolveIcon) {
        addImportsSources({
          from: '@vexip-ui/icons',
          imports: Array.from(imports.icons).map((icon) => [
            icon,
            `${iconPrefix}${iconFirstNumberRE.test(icon) ? icon : `I${icon}`}`
          ])
        })
      }
    }

    nuxt.options.build.transpile.push('vexip-ui')

    const hasSourcemap = compare(version, '2.1.19', '>=')

    const getSourcemap = (isClient: boolean) => {
      const sourcemap = nuxt.options.sourcemap[isClient ? 'client' : 'server']

      return hasSourcemap && (sourcemap === 'hidden' ? false : sourcemap)
    }

    extendViteConfig(config => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('vexip-ui', '@vexip-ui/icons')

      const basePath = options.themeVarsPath.base
      const darkPath = options.themeVarsPath.dark

      if (!basePath && !darkPath) return

      config.css = config.css || {}
      config.css.preprocessorOptions = config.css.preprocessorOptions || {}
      config.css.preprocessorOptions.scss = config.css.preprocessorOptions.scss || {}

      const customValue = config.css.preprocessorOptions.scss.additionalData
      const vxpStylePresetRE = /vexip-ui\/style(?:\/dark)?\/preset/

      let origin: (code: string, path: string) => string

      if (typeof customValue === 'string') {
        origin = code => customValue + '\n' + code
      } else if (typeof customValue === 'function') {
        origin = customValue
      } else {
        origin = code => code
      }

      config.css.preprocessorOptions.scss.additionalData = (code: string, path: string) => {
        if (vxpStylePresetRE.test(path)) {
          if (darkPath && path.includes('dark')) {
            return code.replace('@use \'./variables.scss\' as *;', `@use '${darkPath}' as *;`)
          }

          if (basePath) {
            return code.replace('@use \'./design/variables.scss\' as *;', `@use '${basePath}' as *;`)
          }
        }

        return origin(code, path)
      }
    })

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      config.plugins = config.plugins || []
      config.plugins.push(
        transform.vite({
          ...options,
          plugins: libPlugins,
          sourcemap: getSourcemap(isClient)
        })
      )
    })

    nuxt.hook('webpack:config', (configs) => {
      for (const config of configs) {
        config.plugins = config.plugins || []
        config.plugins.push(
          transform.vite({
            ...options,
            plugins: libPlugins,
            sourcemap: getSourcemap(config.name === 'client')
          })
        )
      }
    })
  }
})
