<script setup lang="ts">
const hide = useSavedCookie('hide-beta-alert-v1', {
  default: () => false,
})
const betaAlertDialog = ref<HTMLDialogElement | null>(null)

function setHidden() {
  hide.value = true
  infoAlert('The beta alert would be hidden until next update')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="!hide" class="toast toast-center z-50">
      <div class="alert alert-info">
        <Icon name="mdi:lightbulb-on-outline" size="24" />
        <span>This is the next version of Cytoid.io</span>
        <div>
          <button class="btn btn-sm btn-info" @click="betaAlertDialog?.showModal()">
            More
          </button>
        </div>
      </div>
    </div>

    <dialog ref="betaAlertDialog" class="modal">
      <form method="dialog" class="modal-box flex flex-col gap-4">
        <div class="flex justify-between">
          <h3 class="font-bold text-lg">
            Beta version
          </h3>
          <button class="btn btn-warning btn-xs" @click="setHidden">
            <Icon name="mdi:eye-off-outline" size="16" />
            Never Show
          </button>
        </div>
        <p>
          You are in the next version of Cytoid.io. This version is still in beta and may contain bugs. Please report any bugs you find to the Discord server.
        </p>
        <div class="modal-action mt-0">
          <div class="flex-1" />
          <button class="btn btn-neutral btn-square">
            <Icon name="mdi:close" size="24" />
          </button>
          <NuxtLink to="https://discord.gg/cytoid" class="btn btn-primary">
            {{ $t('homepage.connect_discord_btn') }}
          </NuxtLink>
        </div>
      </form>
    </dialog>
  </Teleport>
</template>
