<template>
  <div class="container" style="margin-top: 256px;">
    <a-row style="margin-bottom: 48px;">
      <a-col :span="24">
        <div style="display: inline-flex; padding-left: 32px;">
          <div style="display: inline-block;">
            <a-avatar :size="128" src="https://cytoid.io/api/avatar.php?id=tigerhix&size=512" style="" />
            <a-progress
              type="dashboard"
              :percent="((data.exp - data.prev_level_exp) / (data.next_level_exp - data.prev_level_exp)) * 100"
              :format="percent => ''"
              :width="152"
              :stroke-width="4"
              :stroke-color="'hsla(226, 68%, 67%, 1)'"
              style="position: absolute; margin-top: -140px; margin-left: -12px"
            />
            <span class="level-badge-background" />
            <span class="level-badge">
              <span style="display: flex; font-size: 12px; font-weight: bold; color: hsla(226, 68%, 87%, 1); margin-bottom: -4px;">LV.</span>
              <span style="display: flex; font-size: 14px; color: hsla(226, 68%, 67%, 1);">{{ data.level }}</span>
            </span>
            <span class="rating-badge">
              <span style="display: flex; font-size: 14px; color: white;">{{ data.rating }} rt</span>
            </span>
          </div>
          <div style="display: inline-block; margin-left: 32px;">
            <h2 style="margin-bottom: 4px;">
              {{ data.user.name }}
            </h2>
            <div style="display: flex; align-items: center; margin-bottom: 32px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; font-size: 14px; width: 16px;">
                <font-awesome-icon icon="circle" style="color: hsla(120, 68%, 57%, 1);" />
              </div>
              <span style="display: inline-block; font-size: 14px; margin-left: 8px;">Online</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-flex; align-items: center; justify-content: center; font-size: 12px; width: 16px;">
                <font-awesome-icon icon="map-marker-alt" />
              </span>
              <span style="font-size: 12px; margin-left: 8px;">Hong Kong</span>
              <span style="display: inline-flex; align-items: center; justify-content: center; font-size: 12px; width: 16px; margin-left: 16px;">
                <font-awesome-icon icon="calendar" />
              </span>
              <span style="font-size: 12px; margin-left: 8px;">Joined August 2017</span>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :xs="{ span: 24 }" :lg="{ span: 8 }" :xl="{ span: 6 }">
        <a-card style="margin-bottom: 16px;">
          <p class="card-heading">
            Bio
          </p>
          <p style="margin-bottom: -1rem;" v-html="bio" />
        </a-card>
        <a-card>
          <p class="card-heading">
            Recent ranks
          </p>
          <p
            v-for="rank in data.activity.recent_ranks"
            :key="rank.timestamp"
            class="recent-rank">
            Ranked #{{ rank.rank }} in
            <nuxt-link :to="'/levels/' + rank.uid">
              {{ rank.title }}
            </nuxt-link>
          </p>
        </a-card>
      </a-col>
      <a-col :xs="{ span: 24 }" :lg="{ span: 16 }" :xl="{ span: 18 }">
        <a-card class="statistics-card">
          <a-row>
            <a-col :xs="{ span: 12 }" :md="{ span: 8 }">
              <p class="card-heading">
                Ranked plays
              </p>
              <p class="statistics-slot">
                {{ data.activity.total_ranked_plays }}
              </p>
            </a-col>
            <a-col :xs="{ span: 12 }" :md="{ span: 8 }">
              <p class="card-heading">
                Cleared notes
              </p>
              <p class="statistics-slot">
                {{ commaSeparated(data.activity.cleared_notes) }}
              </p>
            </a-col>
            <a-col :xs="{ span: 12 }" :md="{ span: 8 }">
              <p class="card-heading">
                Max combo
              </p>
              <p class="statistics-slot">
                {{ commaSeparated(data.activity.max_combo) }}
              </p>
            </a-col>
            <a-col :xs="{ span: 12 }" :md="{ span: 8 }">
              <p class="card-heading">
                Average ranked accuracy
              </p>
              <p class="statistics-slot">
                {{ data.activity.average_ranked_accuracy }}
              </p>
            </a-col>
            <a-col :xs="{ span: 12 }" :md="{ span: 8 }">
              <p class="card-heading">
                Total ranked score
              </p>
              <p class="statistics-slot">
                {{ commaSeparated(data.activity.total_ranked_score) }}
              </p>
            </a-col>
            <a-col :xs="{ span: 12 }" :md="{ span: 8 }">
              <p class="card-heading">
                Total play time
              </p>
              <p class="statistics-slot">
                {{ data.activity.total_play_time }}
              </p>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import marked from 'marked'
export default {
  data: () => ({
    data: {
      user: {
        name: 'tigerhix',
        uid: 'tigerhix',
        birthday: 911508473,
        last_login: 1557866873,
        registration_date: 1502743673,
        region: 'hk',
      },
      profile: {
        badges: ['developer'],
        bio: 'I made this game. Please donate.',
      },
      rating: 11.92,
      level: 110,
      exp: 1770057,
      prev_level_exp: 1750000,
      next_level_exp: 1802797,
      grades: {
        'max': 1,
        'sss': 78,
        'ss': 143,
        's': 87,
        'aa': 327,
        'a': 145,
      },
      activity: {
        total_ranked_plays: 2396,
        cleared_notes: 2175411,
        max_combo: 3122,
        average_ranked_accuracy: 97.69,
        total_ranked_score: 2311154638,
        total_play_time: '32d 12h 13m',
        recent_ranks: [
          {
            rank: 1,
            type: 'easy',
            score: 999700,
            title: '第三套全国中学生广播体操',
            uid: 'kailaizuozaocao',
            timestamp: 192319231,
          },
          {
            rank: 40,
            type: 'extreme',
            score: 852300,
            title: 'Show me your Rage',
            uid: 'flina.showmeyourdespair',
            timestamp: 192319231,
          },
        ],
      },
    },
  }),
  computed: {
    bio() {
      return marked(this.data.profile.bio || 'There is no bio yet.')
    }
  },
  methods: {
    commaSeparated(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  mounted() {
    this.$root.$emit('background', { source: '/images/Laeti.jpg' })
  },
}
</script>

<style lang="less" scoped>
  .level-badge {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 8px 16px;
    margin-top: -148px;
    margin-left: 64px;
    transform: translate(-50%, 0);
  }
  .level-badge-background {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-top: -156px;
    margin-left: 64px;
    transform: translate(-50%, 0);
    background: #fff;
  }
  .rating-badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 8px 16px;
    margin-top: -20px;
    margin-left: 64px;
    border-radius: 16px;
    transform: translate(-50%, 0);
    background: linear-gradient(to left, #B06AB3, #4568DC);
  }
  .statistics-card {
    background: linear-gradient(to right bottom, @theme4, @theme5);
  }
  .statistics-slot {
    margin-top: -4px;
    margin-bottom: 12px;
    font-size: 24px;
    font-weight: 300;
  }
  .recent-rank {
    margin: 0 -24px;
    padding: 4px 24px;
    transition: 0.4s @hoverEasing;
  }
  .recent-rank:hover {
    background: rgba(0, 0, 0, 0.2);
  }
</style>
