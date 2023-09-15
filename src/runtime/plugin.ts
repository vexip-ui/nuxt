import { defineNuxtPlugin } from '#app'

import { Confirm, Contextmenu, Loading, Message, Notice, Toast } from 'vexip-ui'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp
    .use(Confirm)
    .use(Contextmenu)
    .use(Loading)
    .use(Message)
    .use(Notice)
    .use(Toast)
})
