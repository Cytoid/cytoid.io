<script setup lang="ts">
const { user } = useAuth()

const query = gql(`
  query GetUserSecuritySettings {
    my {
      externals: externalAccountProviders
    }
  }
`)

const membershipPending = useServiceFetch<MembershipResponse>('/membership', { server: false })
const externalsPending = useAsyncQuery(query)

const { data: membership } = await membershipPending
const { data: externals } = await externalsPending

// async function reloadMembershipStatus(provider: string) {
//   reloadNuxtApp()
// }
</script>

<template>
  <div v-if="user" class="flex flex-col gap-5">
    <DonationQuote
      v-if="membership"
      :membership="membership"
      :externals="externals?.my?.externals ?? []"
      :user-uid="user.uid"
      :name="user.name ?? user.uid"
      :quote="membership.quote ?? ''"
    />
    <DonationVerifier v-else :externals="externals?.my?.externals ?? []" />
  </div>
  <div v-else class="alert alert-error border-0 bg-secondary">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>
</template>
