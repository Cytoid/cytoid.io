<script setup lang="ts">
const { user } = useAuth()

const query = gql(/* GraphQL */`
  query GetUserSecuritySettings {
    my {
      externals: externalAccountProviders
    }
  }
`)

const membershipPending = useServiceFetch<MembershipResponse>('/membership')
const externalsPending = useAsyncData(() => useQuery(query))

const { data: membership } = await membershipPending
const { data: externals } = await externalsPending
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
    <DonationVerifier v-else />
  </div>
  <div v-else class="alert alert-error bg-secondary border-0">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>
</template>
