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
    me() {
      return this.$store.state.users.me;
    },
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    },
    hasMorePost() {
      return this.$store.state.posts.hasMorePost;
    },
  },
  // fetch({ store, params }) {
  //   return Promise.all([
  //     store.dispatch("posts/loadUserPosts", {
  //       userId: params.id,
  //       reset: true,
  //     }),
  //     store.dispatch("users/loadOther", {
  //       userId: params.id,
  //     }),
  //   ]);
  // },
  fetch({ store }) {
    return store.dispatch("posts/loadPosts");
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
          this.$store.dispatch("posts/loadPosts");
        }
      }
    },
  },
};
</script>

<style></style>
