import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { createFilter } from '@rollup/pluginutils'
import { toCapitalCase } from '@vexip-ui/utils'
import { getSideEffects, queryImports } from './resolver'

import type { ModuleOptions } from './types'

export interface TransformOptions extends ModuleOptions {
  plugins: string[],
  sourcemap: boolean
}

const componentsRegExp =
  /(?<=[ (])_?resolveComponent\(\s*["'](lazy-|Lazy)?([^'"]*?)["'][\s,]*[^)]*\)/g
const directivesRegExp =
  /(?<=[ (])_?resolveDirective\(\s*["']([^'"]*?)["'][\s,]*[^)]*\)/g

export const transform = createUnplugin((options: TransformOptions) => {
  const { components, directives } = queryImports()

  const { prefix, iconPrefix, sourcemap } = options
  const pluginsRE = new RegExp(
    `\\b(${options.plugins
      .map((plugin) => `${prefix}${plugin}`)
      .join('|')})\\b`,
    'g'
  )

  function removePrefix(name: string) {
    if (prefix || iconPrefix) {
      let matched = false

      if (prefix && name.startsWith(prefix)) {
        matched = true
        name = name.substring(prefix.length)
      } else if (iconPrefix && name.startsWith(iconPrefix)) {
        matched = true
        name = name.substring(iconPrefix.length)
      }

      return { name, matched }
    }

    return { name, matched: true }
  }

  return {
    name: 'vexip-ui:transform',

    enforce: 'post',

    transformInclude: createFilter(options.include, options.exclude),

    async transform(code, id) {
      const source = new MagicString(code)
      const imports = new Set<string>()
      const matched = new Set<string>()

      let index = 0

      const addImports = (paths: string[]) => {
        for (const path of paths) {
          path && imports.add(`import '${path}'`)
        }
      }

      code.replace(componentsRegExp, (full, _lazy, name: string) => {
        const result = removePrefix(toCapitalCase(name))

        if (!result.matched) return full

        name = result.name

        if (!matched.has(name)) {
          components.has(name) && addImports(getSideEffects(name, options))
          matched.add(name)
        }

        return full
      })

      code.replace(pluginsRE, (full, name: string) => {
        const result = removePrefix(toCapitalCase(name))

        if (!result.matched) return full

        name = result.name

        if (!matched.has(name)) {
          addImports(getSideEffects(name, options))
          matched.add(name)
        }

        return full
      })

      if (options.directives) {
        source.replace(directivesRegExp, (full, name: string) => {
          name = `v${toCapitalCase(name)}`
          const relatedComponents = directives[name]

          if (relatedComponents) {
            const alias = `__vexip_directive_${index++}`

            imports.add(`import { ${name} as ${alias} } from 'vexip-ui'`)

            for (const component of relatedComponents) {
              !matched.has(component) &&
                addImports(getSideEffects(component, options))
            }

            return alias
          }

          return full
        })
      }

      if (imports.size) {
        source.prepend(Array.from(imports).join('\n') + '\n')
      }

      if (source.hasChanged()) {
        return {
          code: source.toString(),
          map: sourcemap
            ? source.generateMap({ source: id, includeContent: true })
            : undefined
        }
      }
    }
  }
})
