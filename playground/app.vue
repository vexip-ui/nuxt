<template>
  <VButton type="success" :icon="IUser" @click="onClick">
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
</template>

<script setup>
function onClick() {
  VMessage.success('Success!')
}
</script>
