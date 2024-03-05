<script setup lang="ts">
const query = gql(`
  query FetchPosts($skip: Int, $limit: Int!){
    posts: getPosts(limit: $limit, skip: $skip) {
      id
      uid
      title
      slogan
      cover {
        stripe
      }
      creationDate
    }
  }
`)

const limit = 32

const { data } = await useAsyncQuery(query, {
  limit,
  skip: null,
})

const posts = ref(data.value?.posts ?? [])

const loading = ref(false)
const noMore = ref(false)

async function loadMore() {
  loading.value = true
  const newPosts = await useQuery(query, {
    limit,
    skip: posts.value.length,
  })
  const oldLength = posts.value.length
  if (newPosts?.posts && newPosts.posts.length > 0) {
    posts.value.push(...newPosts.posts)
  }
  if (oldLength + limit > posts.value.length) {
    noMore.value = true
  }
  loading.value = false
}
defineCytoidPage({
  title: 'Posts',
})
</script>

<template>
  <div class="grid gap-4 max-w-3xl mx-auto">
    <div class="grid gap-4">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <button v-if="!noMore" class="btn btn-primary btn-block" @click="loadMore">
      {{ $t('general.more_btn') }}
    </button>
    <progress v-if="loading" class="progress progress-info w-full" />
  </div>
</template>
