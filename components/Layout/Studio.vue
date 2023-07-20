<template>
  <div class="md:grid md:grid-cols-12 md:grid-flow-col md:gap-4">
    <div id="StudioMenu" class="col-span-3">
      <slot name="StudioMenu" />
    </div>

    <div class="col-span-9 mt-4 md:mt-0">
      <slot />
    </div>
  </div>
</template>
