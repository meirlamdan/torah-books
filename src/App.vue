<script setup>
import { ref, computed, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton
} from '@headlessui/vue'
import { IconSelector } from '@tabler/icons-vue';

import DisplayText from '@/components/DisplayText.vue'
import books from '@/books.json'

const selectedBook = ref(books[0])
const inProgressFileTex = ref(false)
const inProgressFileJson = ref(false)
const inProgressShowText = ref(false)
const inProgress = computed(() => inProgressFileTex.value || inProgressFileJson.value || inProgressShowText.value)
const data = ref(null)
const query = ref('')

watch(selectedBook, () => {
  data.value = null
})

const filteredBooks = computed(() =>
  !query.value
    ? books
    : books.filter((book) =>
      book.name
        .replace(/\s+/g, '')
        .includes(query.value.replace(/\s+/g, ''))
    )
)
const getFile = async (format) => {
  const baseUrl = `https://ungh.cc/repos/Sefaria/Sefaria-Export/files/master/${format}/${selectedBook.value.path}/Hebrew/merged.${format}`;
  format === 'txt' ? inProgressFileTex.value = true : inProgressFileJson.value = true
  try {
    const json = await (await fetch(baseUrl)).json();
    const text = json.file.contents;
    const url = format === 'txt' ? URL.createObjectURL(new Blob([text], { type: 'text/plain' })) : URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const downloadLink = document.createElement('a');
    downloadLink.href = url
    downloadLink.download = `${selectedBook.value.name}.${format}`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error)
  } finally {
    inProgressFileTex.value = false
    inProgressFileJson.value = false
  }
}

const showText = async () => {
  inProgressShowText.value = true
  try {
    const baseUrl = `https://ungh.cc/repos/Sefaria/Sefaria-Export/files/master/json/${selectedBook.value.path}/Hebrew/merged.json`;
    const json = await (await fetch(baseUrl)).json();
    const text = json.file.contents;
    data.value = JSON.parse(text)
  } catch (error) {
    console.error(error)
  } finally {
    inProgressShowText.value = false
  }
}
</script>

<template>
  <div class="text-center">
    <div class="text-2xl">ספרי קודש להורדה</div>
    <Combobox as="div" v-model="selectedBook" class="text-center w-60 mx-auto mt-20">
      <div class="relative w-full">
        <ComboboxInput @change="query = $event.target.value" :displayValue="(book) => book.name"
          class="border w-full rounded h-8 pr-6 " />
        <ComboboxButton class="absolute right-1 top-2 ">
          <IconSelector :size="18" class="text-slate-500" />
        </ComboboxButton>
      </div>
      <ComboboxOptions class=" max-h-48 overflow-auto px-1">
        <ComboboxOption v-for="book in filteredBooks" :key="book.name" :value="book"
          class="bg-slate-50 my-1 rounded cursor-pointer hover:bg-slate-100 ui-selected:bg-slate-300">
          {{ book.name }}
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>
    <div v-if="selectedBook" class="flex justify-center gap-4 mt-20">
      <button
        class="bg-blue-800 text-white px-2 py-1 rounded-md flex gap-2 items-center focus:outline-none hover:bg-blue-900 hover:shadow-lg"
        @click="showText" :disabled="inProgress">
        <span>הצג טקסט</span>
        <div v-if="inProgressShowText"
          class="w-4 h-4 rounded-full animate-spin border-2 border-solid border-white border-t-transparent">
        </div>
      </button>
      <button
        class="bg-blue-800 text-white px-2 py-1 rounded-md flex gap-2 items-center focus:outline-none hover:bg-blue-900 hover:shadow-lg"
        @click="showText" :disabled="inProgress">
        <span>הורד קובץ json</span>
        <div v-if="inProgressFileJson"
          class="w-4 h-4 rounded-full animate-spin border-2 border-solid border-white border-t-transparent">
        </div>
      </button>
      <button
        class="bg-blue-800 text-white px-2 py-1 rounded-md flex gap-2 items-center focus:outline-none hover:bg-blue-900 hover:shadow-lg"
        @click="showText" :disabled="inProgress">
        <span>הורד קובץ טקסט</span>
        <div v-if="inProgressFileTex"
          class="w-4 h-4 rounded-full animate-spin border-2 border-solid border-white border-t-transparent">
        </div>
      </button>
    </div>
    <div v-if="data" class="mt-24">
      <div class="text-xl mb-3">{{ selectedBook.name }}</div>
      <DisplayText :data="data" />
    </div>
  </div>
</template>

<style scoped></style>
