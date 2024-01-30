import type { FilterPattern } from '@rollup/pluginutils'

export interface ModuleOptions {
  /**
   * Include files that need to automatically resolve
   *
   * @default
   * [
   *   /\.vue$/,
   *   /\.vue\?vue/,
   *   /\.vue\?v=/,
   *   /\.((c|m)?j|t)sx?$/
   * ]
   */
  include: FilterPattern,
  /**
   * Include files that don't need to automatically resolve
   *
   * @default
   * [
   *   /[\\/]node_modules[\\/]/,
   *   /[\\/]\.git[\\/]/,
   *   /[\\/]\.nuxt[\\/]/
   * ]
   */
  exclude: FilterPattern,
  /**
   * Import css or sass styles with components
   *
   * @default 'css'
   */
  importStyle: boolean | 'css' | 'sass',
  /**
   * Import the dark theme preset styles
   *
   * @default false
   */
  importDarkTheme: boolean,
  /**
   * Whether import all styles at once
   *
   * It will be true if don't specify and run in dev mode
   *
   * @default undefined
   */
  fullStyle?: boolean,
  /**
   * Specify path of custom theme variables files
   *
   * You'd better pass the path of using alias (eg. `@/style/variables.scss`)
   *
   * @default {}
   */
  themeVarsPath: {
    base?: string,
    dark?: string
  },
  /**
   * Prefix for name of components
   *
   * @default 'V'
   */
  prefix: string,
  /**
   * Auto import for directives
   *
   * @default true
   */
  directives: boolean,
  /**
   * Resolve icon components from '@vexip-ui/icons'
   *
   * @default true
   */
  resolveIcon: boolean,
  /**
   * Prefix for name of icon components, same to `prefix` if undefined or null
   *
   * @default ''
   */
  iconPrefix: string
}
