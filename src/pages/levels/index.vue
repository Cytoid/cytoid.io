<template>
  <div>
    <level-card data-image="https://images.unsplash.com/photo-1479660656269-197ebb83b540?dpr=2&auto=compress,format&fit=crop&w=1199&h=798&q=80&cs=tinysrgb&crop=">
      <h1 slot="header">Canyons</h1>
      <p slot="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
    </level-card>
    <!--<a-card>
      <div style="width: 100%; padding-top: 62.5%">
        <img class="unselectable" style="border-radius: 4px; width: 100%; height: 100%; position: absolute; top: 0;"/>
      </div>
    </a-card>-->
  </div>
</template>

<script>
import LevelCard from '@/components/level/LevelCard'
export default {
  components: {
    LevelCard
  }
}
</script>
