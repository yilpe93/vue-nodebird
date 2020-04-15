<template>
  <v-container>
    <PostCard />
    <PostCard />
    <PostCard />
    <PostCard />
    <PostCard />
  </v-container>
</template>

<script>
const PostCard = () => import("~/components/PostCard");

export default {
  components: {
    PostCard,
  },
};
</script>

<style></style>
