<template>
  <div>
    <post-images :images="post.Images || []" />
    <v-card-text>
      <div>
        <h3>
          <nuxt-link :to="'/user/' + post.id">
            {{ post.User.nickname }}
          </nuxt-link>
          <v-btn v-if="canFollow" @click="onFollow">팔로우</v-btn>
          <v-btn v-if="canUnFollow" @click="onUnFollow">언팔로우</v-btn>
        </h3>
        <p>
          {{ post.content }}
        </p>
      </div>
    </v-card-text>
  </div>
</template>

<script>
const PostImages = () => import("~/components/PostImages");

export default {
  components: {
    PostImages,
  },
  props: {
    post: {
      type: Object,
    },
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
    canFollow() {
      return (
        this.me &&
        this.post.User.id !== this.me.id &&
        !this.me.Followings.find((v) => v.id === this.post.User.id)
      );
    },
    canUnFollow() {
      return (
        this.me &&
        this.post.User.id !== this.me.id &&
        this.me.Followings.find((v) => v.id === this.post.User.id)
      );
    },
  },
  methods: {
    onFollow() {
      this.$store.dispatch("users/follow", {
        userId: this.post.User.id,
      });
    },
    onUnFollow() {
      this.$store.dispatch("users/unFollow", {
        userId: this.post.User.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: inherit;
}</style
>>
