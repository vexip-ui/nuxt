import { readFileSync } from 'node:fs'
import { getPackageInfoSync, resolveModule } from 'local-pkg'
import { compare } from 'compare-versions'
import { toKebabCase } from '@vexip-ui/utils'

import * as Icons from '@vexip-ui/icons'

import type { ModuleOptions } from './types'

function throwLoadError() {
  throw new Error(
    '[vexip-ui:nuxt] failed to load vexip-ui, have you installed it?'
  )
}

const icons = new Set(Object.keys(Icons))

let version: string | undefined
let metaPath: string | undefined
let lowerVersion = false

let components: Set<string> | undefined
let styleAlias: Record<string, string> | undefined
let directives: Record<string, string[]> | undefined

export function queryVersion() {
  if (version) return version

  try {
    version =
      getPackageInfoSync('vexip-ui')?.version ??
      getPackageInfoSync('vexip-ui', {
        paths: [resolveModule('vexip-ui') || process.cwd()]
      })?.version

    metaPath = compare(version!, '2.1.18', '<')
      ? 'vexip-ui/meta-data.json'
      : 'vexip-ui/meta-data/components.json'

    if ((lowerVersion = compare(version!, '2.1.10', '<'))) {
      console.warn(
        '[vexip-ui:nuxt] style has been refactored in vexip-ui@2.1.10, you better ' +
          'upgrade it to support import style via esm.'
      )
    }
  } catch (e) {
    console.error(e)
    throwLoadError()
  }

  if (!version) throwLoadError()

  return version!
}

export function queryImports() {
  if (components && styleAlias && directives) {
    return { icons, components, styleAlias, directives }
  }

  if (!version) queryVersion()

  try {
    const root = resolveModule('vexip-ui') || process.cwd()
    const path =
      resolveModule(metaPath!) || resolveModule(metaPath!, { paths: [root] })
    const metaData = JSON.parse(readFileSync(path!, 'utf-8'))

    components = new Set(metaData.components)
    styleAlias = metaData.styleAlias
    directives = metaData.directives
  } catch (e) {
    console.error(e)
    throwLoadError()
  }

  return {
    icons,
    components: components!,
    styleAlias: styleAlias!,
    directives: directives!
  }
}

export function queryBaseStyles(options: ModuleOptions) {
  const { importStyle, importDarkTheme } = options

  if (!importStyle) return []
  if (!version) queryVersion()

  if (lowerVersion) {
    if (importStyle === 'sass') {
      return [
        'vexip-ui/style/preset.scss',
        ...(importDarkTheme ? ['vexip-ui/style/dark/preset.scss'] : [])
      ]
    } else {
      return [
        'vexip-ui/css/preset.css',
        ...(importDarkTheme ? ['vexip-ui/themes/dark/index.css'] : [])
      ]
    }
  }

  if (importStyle === 'sass') {
    return importDarkTheme ? ['vexip-ui/es/style/dark'] : []
  } else {
    return importDarkTheme ? ['vexip-ui/es/css/dark'] : []
  }
}

export function getSideEffects(name: string, options: ModuleOptions) {
  const { importStyle } = options

  if (!importStyle) return []

  if (styleAlias && styleAlias[name]) {
    name = styleAlias[name]
  }

  name = toKebabCase(name)

  if (lowerVersion) {
    if (importStyle === 'sass') {
      return [`vexip-ui/style/${name}.scss`]
    } else {
      return [`vexip-ui/css/${name}.css`]
    }
  }

  if (importStyle === 'sass') {
    return [`vexip-ui/es/style/${name}`]
  } else {
    return [`vexip-ui/es/css/${name}`]
  }
}
