<script setup lang="ts">
const { user } = useAuth()

const query = gql(`
  query GetSettingsProfile($id: ID!) {
    profile(id: $id) {
      id
      bio
      birthday
      header {
        stripe
      }
    }
  }
`)
const mutation = gql(`
  mutation UpdateProfile($input: ProfileInput!) {
    result: updateProfile(input: $input)
  }
`)

const { data } = await useAsyncQuery(query, {
  id: user.value?.id ?? '',
})

const birthday = ref<string>(data.value?.profile?.birthday ?? '')
const bio = ref(data.value?.profile?.bio ?? '')

const loading = ref(false)
async function saveProfile() {
  loading.value = true

  try {
    await useMutation(mutation, {
      input: {
        birthday: birthday.value,
        bio: bio.value,
      },
    })
    successAlert('Profile Updated')
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}
</script>

<template>
  <div class="card w-full bg-base-100 shadow-xl overflow-hidden">
    <div class="card-body card flex flex-col gap-2">
      <h2 class="card-subtitle mb-2">
        {{ $t('general.birthday') }}
      </h2>
      <div class="form-control">
        <div class="join w-full">
          <label for="birthday" class="join-item btn btn-neutral">
            <Icon name="mdi:cake-variant-outline" size="20" />
          </label>
          <input
            v-model="birthday" type="date"
            :placeholder="$t('general.birthday')"
            min="1900-01-01"
            :max="new Date().toISOString().split('T')[0]"
            class="join-item input input-bordered flex-1 w-full"
          >
        </div>
      </div>

      <h2 class="card-subtitle m-2">
        {{ $t('settings.profile_bio_title') }}
      </h2>
      <Editor v-model="bio" />
      <div class="card-actions justify-end">
        <button class="btn btn-primary" :disabled="loading" @click="saveProfile">
          <Icon v-if="loading" name="mdi:loading" size="20" class="animate-spin" />
          {{ $t('general.save_btn') }}
        </button>
      </div>
    </div>
  </div>
</template>
