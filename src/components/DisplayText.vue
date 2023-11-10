<script setup>
import { ref, computed } from 'vue'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import { IconChevronUp } from '@tabler/icons-vue';
import hebrewChapterNumber from '@/hebrewChapterNumber';
import ClipBoard from '@/components/ClipBoard.vue';
const divText = ref(null);

defineProps(['data'])

</script>

<template>
  <div class="max-w-md max-h-screen mx-auto overflow-auto px-2"  v-if="data.text?.length">
    <Disclosure as="div" v-for="(text, i) in data.text" :key="i" class="mb-1" v-slot="{ open }">
      <DisclosureButton
        class="py-2 w-full justify-between rounded-lg  bg-slate-100 px-4 text-sm font-medium text-purple-900 flex items-center"
        v-if="text.length">
        <IconChevronUp :size="16" :class="open ? 'rotate-180 transform' : ''" class="transition-transform"/>
        <span class="">{{ hebrewChapterNumber(i + 1, data.sectionNames[0]
        ) }}</span>
      </DisclosureButton>
      <DisclosurePanel class="text-gray-500 text-justify px-2 ">
        <ClipBoard :text="Array.isArray(text) ? text.join(' ') : text" class="" />
        <div ref=" divText" v-html="Array.isArray(text) ? text.join(' ') : text">
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>
