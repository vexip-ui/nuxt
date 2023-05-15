<p align="center">
  <a href="https://www.vexipui.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://www.vexipui.com/vexip-ui.svg" width="180" style="width: 180px;" />
  </a>
</p>

<h1 align="center">Vexip UI Nuxt</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@vexip-ui/nuxt" target="_blank">
    <img src="https://img.shields.io/github/package-json/v/vexip-ui/nuxt" alt="npm version"/>
  </a>
</p>

<p align="center">
  <a href="https://nuxt.com/" target="_blank" rel="noopener noreferrer">
    Nuxt
  </a>
  Module for
  <a href="https://www.vexipui.com/" target="_blank" rel="noopener noreferrer">
    Vexip UI
  </a>
</p>

## Features

- 🏆 Automatically import components, plugins, directives, icons and their styles on demand

## Quick Setup

Add `@vexip-ui/nuxt` dependency to your project:

```sh
# Using pnpm
pnpm i -D @vexip-ui/nuxt

# Using yarn
yarn add -D @vexip-ui/nuxt
```

If you want to control the version of Vexip UI, you need to add `vexip-ui` dependency to your project too:

```sh
# Using pnpm
pnpm i -D vexip-ui

# Using yarn
yarn add -D vexip-ui
```

Add `@vexip-ui/nuxt` to the `modules` section of `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: [
    '@vexip-ui/nuxt'
  ],
  vexipUI: {
    // Your module options
  }
})
```

That's it! You can now use Vexip UI in your Nuxt app:

```vue
<template>
  <VButton :icon="IUser" @click="handleClick">
    Button
  </VButton>
  <VIcon>
    <ISackDollar></ISackDollar>
  </VIcon>
</template>

<script setup lang="ts">
function handleClick() {
  VMessage.success('Success!')
}
</script>
```

## Module Options

Note that each option has default value, you only need to specify when changing it.

```ts
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
  prefix?: string,
  /**
   * Auto import for directives
   *
   * @default true
   */
  directives?: boolean,
  /**
   * Resolve icon components from '@vexip-ui/icons'
   *
   * @default true
   */
  resolveIcon?: boolean,
  /**
   * Prefix for name of icon components, same to `prefix` if undefined or null
   *
   * @default ''
   */
  iconPrefix?: string
}
```

## Contributors

Thanks for all their contributions!

<a href="https://github.com/vexip-ui/nuxt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=vexip-ui/nuxt" />
</a>

## Development

```sh
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint

# Run Vitest
pnpm run test
pnpm run test:watch
```

## License

All in [MIT](./LICENSE.md) license.
