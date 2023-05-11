import { Confirm, Contextmenu, Loading, Message, Notice, Toast } from 'vexip-ui'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp
    .use(Confirm)
    .use(Contextmenu)
    .use(Loading)
    .use(Message)
    .use(Notice)
    .use(Toast)
})
