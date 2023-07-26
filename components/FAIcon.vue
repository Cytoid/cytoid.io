<script setup lang="ts">
const props = defineProps<{
  package: string
  icon: string
}>()

const { data } = await useAsyncData(
  `${props.package}/${props.icon}`,
  () => $fetch<string>(getFaIconUrl(props.package, props.icon), { parseResponse: txt => txt }),
)

function getFaIconUrl(pkgName: string, iconName: string) {
  const iconPackPathMap: { [key: string]: string } = {
    fas: 'solid',
    fad: 'duotone',
    fab: 'brands',
    fal: 'light',
    far: 'regular',
  }
  const url = `https://artifacts.cytoid.io/fontawesome/svgs/${iconPackPathMap[pkgName]}/${iconName}.svg`
  return url
}
</script>

<template>
  <div class="fa-dyn" v-html="data" />
</template>

<style>
.fa-dyn {
  color: #c7d2f4;
  fill: currentColor;
}

.fa-dyn .fa-secondary,
.fa-dyn .fa-primary {
  fill: currentColor;
}

.fa-dyn.is-orange .fa-secondary {
  fill: #ff470f;
  opacity: 1;
}

.fa-dyn.is-yellow .fa-secondary {
  fill: #ffe08a;
  opacity: 1;
}

.fa-dyn.is-green .fa-secondary {
  fill: #48c78e;
  opacity: 1;
}

.fa-dyn.is-turquoise .fa-secondary {
  fill: #00d1b2;
  opacity: 1;
}

.fa-dyn.is-cyan .fa-secondary {
  fill: #3e8ed0;
  opacity: 1;
}

.fa-dyn.is-blue .fa-secondary {
  fill: #485fc7;
  opacity: 1;
}

.fa-dyn.is-purple .fa-secondary {
  fill: #b86bff;
  opacity: 1;
}

.fa-dyn.is-red .fa-secondary {
  fill: #f14668;
  opacity: 1;
}
</style>
