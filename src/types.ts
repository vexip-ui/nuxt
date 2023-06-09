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
