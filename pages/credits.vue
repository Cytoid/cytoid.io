<script setup lang="ts">
const { data } = await useServiceFetch<CreditMeta>('/creditmeta')
const { t } = useLocales()
defineCytoidPage({
  title: t('general.credits'),
})
</script>

<template>
  <div class="hero">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <img src="/images/logo.webp">
        <p class="py-6">
          A community-driven music game
        </p>
      </div>
    </div>
  </div>

  <template v-if="data">
    <div v-for="section, index in data.content" :key="index">
      <div v-if="!section.title" class="mb-4" />
      <div v-else class="mt-0 flex w-full justify-center">
        <div class="flex-1 px-2">
          <div class="ml-auto w-fit tracking-widest opacity-75">
            {{ section.title }}
          </div>
        </div>
        <div class="flex-1 px-2">
          <div v-for="member in section.members" :key="member">
            {{ member }}
          </div>
        </div>
      </div>
    </div>

    <div>
      <p class="mx-auto my-8 w-fit">
        We would like to thank our {{ data.patronsCount }} patrons who donated to keep our servers alive.
      </p>
    </div>

    <div class="px-4">
      <div v-for="patron in data.patrons" :key="patron.owner.uid" class="my-6 ml-4 flex items-center">
        <UserAvatar
          :name="patron.owner.name ?? patron.owner.uid"
          :uid="patron.owner.uid"
          :avatar="patron.owner.avatar.small"
          :transparent="true"
        />
        <p class="px-2 opacity-75">
          {{ patron.quote }}
        </p>
      </div>
    </div>
  </template>
</template>
