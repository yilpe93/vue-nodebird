<template>
  <div>
    <v-card style="margin-bottom: 20px;">
      <!-- <v-image /> -->
      <v-card-text>
        <div>
          <h3>
            <nuxt-link :to="'/user/' + post.id">{{ post.User.nickname }}</nuxt-link>
          </h3>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn text color="orange">
          <v-icon>mdi-twitter-retweet</v-icon>
        </v-btn>
        <v-btn text color="orange">
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>
        <v-btn text color="orange" @click="onToggleComment">
          <v-icon>mdi-comment-outline</v-icon>
        </v-btn>
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on }">
            <v-btn text color="orange" v-on="on">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <div stype="background: white">
            <v-btn dark color="red" @click="onRemovePost">삭제</v-btn>
            <v-btn dark color="orange" @click="onRemovePost">수정</v-btn>
          </div>
        </v-menu>
      </v-card-actions>
    </v-card>

    <template v-if="commentOpened">
      <comment-form :postId="post.id" />
      <v-list>
        <v-list-item v-for="comment in post.Comments" :key="comment.id">
          <v-list-item-avatar color="teal">
            <span>{{ comment.User.nickname[0] }}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ comment.User.nickname }}</v-list-item-title>
            <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </div>
</template>

<script>
const CommentForm = () => import("~/components/CommentForm");

export default {
  components: {
    CommentForm,
  },
  props: {
    post: {
      type: Object,
    },
  },
  data() {
    return {
      commentOpened: false,
    };
  },
  methods: {
    onRemovePost() {
      this.$store.dispatch("posts/removePost", {
        id: this.post.id,
      });
    },
    onToggleComment() {
      this.commentOpened = !this.commentOpened;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: inherit;
  text-decoration: none;
}
</style>
