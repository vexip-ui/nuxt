import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule
} from '@nuxt/kit'
import { queryBaseStyles, queryImports, queryVersion } from './resolver'
import { transform } from './transform'
import { compare } from 'compare-versions'
import { isNull, toCapitalCase } from '@vexip-ui/utils'

import type { ModuleOptions } from './types'

const firstNumberRE = /^I[0-9].*/

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
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    include: [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.((c|m)?j|t)sx?$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    importStyle: true,
    importDarkTheme: false,
    prefix: 'V',
    directives: true,
    resolveIcon: true,
    iconPrefix: ''
  },
  setup(options, nuxt) {
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
              firstNumberRE.test(icon) ? icon : `I${icon}`
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
            `${iconPrefix}${firstNumberRE.test(icon) ? icon : `I${icon}`}`
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
