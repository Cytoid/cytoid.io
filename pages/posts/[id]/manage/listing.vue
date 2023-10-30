<script setup lang="ts">
import { PostType, ResourceState } from '~/gql/graphql'
import type { FetchPostForEditingQuery, PostInput } from '~/gql/graphql'

const props = defineProps<{
  modelValue: FetchPostForEditingQuery
  submit: (data: PostInput) => Promise<void>
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const title = ref(data.value.post?.title ?? '')
const slogan = ref(data.value.post?.slogan ?? '')
const content = ref(data.value.post?.content ?? '')
const visibility = ref<ResourceState>(data.value.post?.state ?? ResourceState.Private)
const type = ref<PostType>(data.value.post?.type ?? PostType.Post)
const locked = ref((data.value.post?.locked && !!data.value.post.epicId) ?? false)

const loading = ref(false)

async function submit() {
  await props.submit({
    title: title.value,
    slogan: slogan.value,
    content: content.value,
    state: visibility.value,
    type: type.value,
    locked: locked.value && !!data.value.post?.epicId,
  })
}
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div class="card bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <!-- Title -->
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Title
          </h2>
          <input
            v-model="title"
            class="input input-bordered"
          >
        </div>

        <!-- Slogan -->
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Slogan
          </h2>
          <input
            v-model="slogan"
            class="input input-bordered"
          >
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Content
          </h2>
          <Editor v-model="content" />
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Visibility
          </h2>
          <div class="w-fit">
            <Selector
              v-model="visibility"
              :items="[
                { value: ResourceState.Public, label: $t('general.visibility_status_public'), icon: 'mdi:earth' },
                { value: ResourceState.Unlisted, label: $t('general.visibility_status_unlisted'), icon: 'mdi:eye-off-outline' },
                { value: ResourceState.Private, label: $t('general.visibility_status_private'), icon: 'mdi:lock-outline' },
              ]"
            />
          </div>
          <label class="label">
            <span class="label-text-alt">
              <p>
                Public: The post is visible on both the game client and Cytoid.io
              </p>
              <p>
                Unlisted: The post is only visible on Cytoid.io "History Posts"              </p>
              <p>
                Private: The post is not active and invisible, but can be visited by post url
              </p>
            </span>
          </label>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Type
          </h2>
          <div class="w-fit">
            <Selector
              v-model="type"
              :items="[
                { value: PostType.Post, label: 'Post' },
                { value: PostType.Event, label: 'Event' },
                { value: PostType.Page, label: 'Page' },
              ]"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Access Restriction
          </h2>
          <label class="w-fit label cursor-pointer flex gap-4 sm:flex-row-reverse">
            <span class="label-text">
              {{ locked ? 'Locked' : 'Unlocked' }}
            </span>
            <input
              v-model="locked"
              type="checkbox"
              class="toggle"
              :disabled="!data.post?.epicId"
              :class="{ 'toggle-warning': locked }"
            >
          </label>
          <label class="label">
            <span class="label-text-alt">
              {{
                !!data.post?.epicId
                  ? `Based on epic ${data.post?.epicId}`
                  : 'Requires an epic to be associated with this post.'
              }}
            </span>
          </label>
        </div>

        <div class="flex flex-col gap-2 items-end">
          <button class="btn btn-primary" :disabled="loading" @click="submit">
            <span v-if="loading" class="loading loading-spinner" />
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
