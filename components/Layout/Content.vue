<template>
  <div class="max-h-128 h-[20vh]" />
  <div>
    <div class="bottom-0 left-0" id="contentTitle">
      <slot name="contentTitle" />
    </div>
  </div>
  <div class="mt-4 md:grid md:grid-cols-12 md:grid-flow-col md:gap-4">
    <div class="col-span-5 lg:col-span-4 xl:col-span-3" id="subContent">
      <slot name="subContent" />
    </div>

    <div class="col-span-7 lg:col-span-8 xl:col-span-9 mt-4 md:mt-0">
      <slot />
    </div>
  </div>
</template>