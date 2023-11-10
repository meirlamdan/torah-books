<script setup>
import { ref } from 'vue';
import { IconClipboardText } from '@tabler/icons-vue';

const props = defineProps(['text'])
const showMsg = ref(false)
const clipToBoard = () => {
  const div = document.createElement('div')
  div.innerHTML = props.text;
  navigator.clipboard.writeText(div.innerText)
    .then(() => {
      showMsg.value = true;
      div.remove();
      setTimeout(() => {
        showMsg.value = false;
      }, 2000);
    })
    .catch((error) => {
      console.error('Failed to clip to board:', error);
    });
}
</script>

<template>
  <div class="flex items-center gap-2 ">
    <IconClipboardText :size="18" @click="clipToBoard" class="cursor-pointer" />
    <span v-if="showMsg" class="text-sm">הועתק!</span>
  </div>
</template>
