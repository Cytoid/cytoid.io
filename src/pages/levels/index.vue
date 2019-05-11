<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col>
        <level-card data-image="/images/Kreutz.png">
          <div slot="title">
            Kreutz
          </div>
          <div slot="uploader">
            tigerhix
          </div>
        </level-card>
      </a-col>
      <a-col>
        <level-card data-image="/images/Laeti.png">
          <div slot="title">
            Omnislash
          </div>
          <div slot="uploader">
            suconh
          </div>
        </level-card>
      </a-col>
      <!--<a-card>
        <div style="width: 100%; padding-top: 62.5%">
          <img class="unselectable" style="border-radius: 4px; width: 100%; height: 100%; position: absolute; top: 0;"/>
        </div>
      </a-card>-->
    </a-row>
  </div>
</template>

<script>
import LevelCard from '@/components/level/LevelCard'

export default {
  components: {
    LevelCard,
  },
}
</script>
