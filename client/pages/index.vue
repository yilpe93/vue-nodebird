<template>
  <v-container>
    <PostForm v-if="me" />
    <div>
      <PostCard v-for="post in mainPosts" :key="post.id" :post="post" />
    </div>
  </v-container>
</template>

<script>
const PostCard = () => import("~/components/PostCard");
const PostForm = () => import("~/components/PostForm");

export default {
  components: {
    PostCard,
    PostForm,
  },
  data() {
    return {};
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    },
  },
};
</script>

<style></style>
