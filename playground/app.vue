<template>
  <VLayout
    logo="https://www.vexipui.com/vexip-ui.svg"
    sign-name="Vexip UI"
    :user="user"
    :menus="menus"
    @user-action="handleUserAction"
  >
    <template #main>
      <div style="width: 100%; height: 1200px; padding: 20px;">
        <VButton type="success" :icon="IUser" @click="handleClick">
          Button
        </VButton>
        <v-auto-complete></v-auto-complete>
        <VIcon>
          <ISackDollar></ISackDollar>
        </VIcon>
        <div
          v-loading="true"
          style="width: 200px; height: 100px; background-color: var(--vxp-bg-color-reverse);"
        ></div>
      </div>
    </template>
  </VLayout>
</template>

<script setup lang="ts">
import type { MenuOptions } from 'vexip-ui'

const user = {
  name: 'VexipUI',
  email: 'email@vexip-ui.com'
}

const menus: MenuOptions[] = [
  {
    label: '1',
    name: '菜单 1',
    icon: IEnvelopesBulk,
    children: [
      { label: '1-1', name: '子菜单 1' },
      { label: '1-2', name: '子菜单 2' },
      { label: '1-3', name: '子菜单 3' }
    ]
  },
  {
    label: '2',
    name: '菜单 2',
    icon: ICity,
    disabled: true
  },
  {
    label: '3',
    name: '菜单 3',
    icon: IChartPie
  },
  {
    label: '4',
    name: '菜单 4',
    icon: IUser
  },
  {
    label: '5',
    name: '菜单 5',
    icon: IMarker
  }
]

function handleUserAction(label: string) {
  console.info(label)
}

function handleClick() {
  VMessage.success('Success!')
}
</script>

<style>
html,
body,
#__nuxt {
  height: 100%;
}

body {
  padding: 0;
  margin: 0;
}
</style>
