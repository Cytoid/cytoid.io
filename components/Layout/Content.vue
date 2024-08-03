<template>
  <div class="max-h-128 h-[20vh]" />
  <div>
    <div id="contentTitle" class="bottom-0 left-0">
      <slot name="contentTitle" />
    </div>
  </div>
  <div>
    <slot name="additionContent" />
  </div>
  <div class="mt-4 md:grid md:grid-flow-col md:grid-cols-12 md:gap-4">
    <div id="subContent" class="col-span-5 lg:col-span-4 xl:col-span-3">
      <slot name="subContent" />
    </div>

    <div class="col-span-7 mt-4 md:mt-0 lg:col-span-8 xl:col-span-9">
      <slot />
    </div>
  </div>
</template>
