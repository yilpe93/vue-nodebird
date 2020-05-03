<template>
  <v-container>
    <v-card style="margin-bottom: 20px;">
      <v-container>
        {{ other.nickname }}
        <v-row>
          <v-col cols="4">{{ other.Followings.length }} 팔로잉</v-col>
          <v-col cols="4">{{ other.Followers.length }} 팔로워</v-col>
          <v-col cols="4">{{ other.Posts.length }} 게시글</v-col>
        </v-row>
      </v-container>
    </v-card>

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
    other() {
      return this.$store.state.users.other;
    },
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    },
    hasMorePost() {
      return this.$store.state.posts.hasMorePost;
    },
  },
  // 컴포넌트 moute되기 전,
  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("users/loadOther", {
        userId: params.id,
      }),
      store.dispatch("posts/loadUserPosts", {
        userId: params.id,
        reset: true
      }),
    ]);
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
          this.$store.dispatch("posts/loadUserPosts");
        }
      }
    },
  },
};
</script>

<style></style>
