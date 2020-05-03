<template>
  <v-container>
    <div>
      <post-card v-for="post in mainPosts" :key="post.id" :post="post" />
    </div>
  </v-container>
</template>

<script>
const PostCard = () => import("~/components/PostCard");

export default {
  components: {
    PostCard,
  },
  data() {
    return {};
  },
  computed: {
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    },
    hasMorePost() {
      return this.$store.state.posts.hasMorePost;
    },
  },
  // 컴포넌트 moute되기 전,
  fetch({ store, params }) {
    return store.dispatch('posts/loadHashtagPosts', {
      hashtag: encodeURIComponent(params.id),
      reset: true
    })
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
    /* 
      # document.documentElement.clientHeight
      # document.documentElement.scrollHeight
      # window.scrollY
      # window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight
    */
  },
  beforeDestroy() {
    window.removeEventListener("scorll", this.onScroll);
  },
  methods: {
    onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (this.hasMorePost) {
          this.$store.dispatch("posts/loadHashtagPosts");
        }
      }
    },
  },
};
</script>

<style></style>
