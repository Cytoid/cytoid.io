<script setup lang="ts">
const props = withDefaults(defineProps<{
  onInput?: (value: string, oldValue: string) => void
  suggestion?: Array<string>
  verified?: { [key: string]: string | undefined | null }
  cleaner?: (value: string) => string | undefined
  allowAdvanced?: boolean
  limited?: boolean
}>(), {
  cleaner: (value: string) => {
    const cleaned = value.trim()
    if (cleaned === '') {
      return undefined
    }
    return cleaned
  },
  allowAdvanced: true,
  limited: false,
})
const itemsData = defineModel<Array<string>>({ required: true })

const items = computed(() => {
  return itemsData.value.map((item) => {
    return item
  })
})

const advancedMode = ref(false)
const advancedText = ref('')
const advancedPreviewItems = computed(() => {
  return stringToTags(advancedText.value)
})
const advancedEdited = computed(() => {
  return tagsToString(items.value) !== advancedText.value
})

const tmpText = ref('')
watch(tmpText, (value, oldValue) => {
  if (props.onInput) {
    props.onInput(value, oldValue)
  }
})
const commonInputDom = ref<HTMLElement>()
const showSuggestion = ref(false)
onClickOutside(commonInputDom, () => showSuggestion.value = false)

function getVerified(value: string) {
  if (props.verified === undefined) {
    return undefined
  }
  const name = props.verified[value]
  if (name === undefined) {
    return null
  }
  if (name === null) {
    return false
  }
  return true
}

function getItemName(val: string) {
  if (props.verified) {
    return props.verified[val] ?? undefined
  }
  return undefined
}

function addItem(value: string) {
  const val = props.cleaner(value)
  if (val && props.limited && !props.suggestion?.includes(val)) {
    return
  }
  if (val && !itemsData.value.find(item => item === val)) {
    itemsData.value = [...itemsData.value, val]
  }
  tmpText.value = ''
}

function addTmpTextToItem() {
  addItem(tmpText.value)
}
function removeLastItem() {
  if (itemsData.value.length === 0) {
    return
  }
  if (tmpText.value === '') {
    itemsData.value = itemsData.value.slice(0, -1)
  }
}
function removeItem(value: string) {
  itemsData.value = itemsData.value.filter(i => i !== value)
}

function saveAdvancedMode() {
  itemsData.value = stringToTags(advancedText.value)
  advancedMode.value = false
}
function startAdvancedMode() {
  advancedMode.value = true
  advancedText.value = tagsToString(items.value)
}

function tagsToString(items: string[]) {
  return items.map(item => item).filter((value, index, self) => self.indexOf(value) === index).join('\n')
}
function stringToTags(text: string) {
  return text.split('\n').map((value) => {
    const val = props.cleaner(value)
    if (val && props.limited && !props.suggestion?.includes(val)) {
      return undefined
    }
    return val
  }).filter(item => item !== undefined) as string[]
}
</script>

<template>
  <div v-if="advancedMode">
    <div class="w-full mb-2">
      <BaseItemInputItemConetent
        v-for="item in advancedPreviewItems" :key="item"
        :name="getItemName(item)"
        :value="item"
        :verified="getVerified(item)"
      />
    </div>
    <div class="w-full flex gap-2">
      <div class="flex-1 join join-vertical">
        <button class="btn btn-primary join-item" :disabled="!advancedEdited" @click="saveAdvancedMode">
          <Icon name="mdi:check" size="24" />
        </button>
        <textarea v-model="advancedText" class="textarea textarea-bordered h-32" />
      </div>
      <button class="btn btn-secondary" @click="advancedMode = false">
        <Icon name="mdi:close" size="24" />
      </button>
    </div>
  </div>
  <div v-else>
    <div class="w-full mb-2">
      <BaseItemInputItemConetent
        v-for="item in items" :key="item"
        :name="getItemName(item)"
        :value="item"
        :remove-item="removeItem"
        :verified="getVerified(item)"
      />
    </div>
    <div class="w-full flex flex-col sm:flex-row gap-2">
      <div class="flex-1 flex relative">
        <div ref="commonInputDom" class="flex-1 join flex">
          <input
            v-model="tmpText" class="input input-bordered join-item flex-1"
            @keyup.enter="addTmpTextToItem"
            @keydown.delete.ctrl="removeLastItem"
            @click="showSuggestion = true"
          >
          <button class="btn btn-primary join-item" @click="addTmpTextToItem">
            <Icon name="mdi:plus" size="24" />
          </button>
        </div>
        <BaseItemInputSuggestionBox
          v-if="suggestion"
          v-show="showSuggestion && suggestion.length > 0"
          :suggestion="suggestion"
          :name-cache="verified"
          :select-suggestion="addItem"
        />
      </div>
      <button v-if="allowAdvanced" class="btn btn-secondary btn-sm sm:btn-md" @click="startAdvancedMode">
        <Icon name="mdi:format-list-bulleted" size="24" />
      </button>
    </div>
  </div>
</template>
