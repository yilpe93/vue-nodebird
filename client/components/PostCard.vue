<template>
  <div style="margin-bottom: 20px;">
    <v-card>
      <div v-if="post.RetweetId && post.Retweet">
        <v-subheader
          >{{ post.User.nickname }}님이 리트윗하셨습니다.</v-subheader
        >
        <v-card>
          <post-content :post="post.Retweet" />
        </v-card>
      </div>
      <post-content v-else :post="post" />

      <v-card-actions>
        <v-btn text color="orange" @click="onRetweet">
          <v-icon>mdi-twitter-retweet</v-icon>
        </v-btn>
        <v-btn text color="orange" @click="onClickHeart">
          <v-icon>{{ heartIcon }}</v-icon>
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
const PostContent = () => import("~/components/PostContent");

export default {
  components: {
    CommentForm,
    PostContent,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      commentOpened: false,
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
    liked() {
      return !!(this.post.Likers || []).find(
        (v) => v.id === (this.me && this.me.id)
      );
    },
    heartIcon() {
      const liked = (this.post.Likers || []).find(
        (v) => v.id === (this.me && this.me.id)
      );
      return this.liked ? "mdi-heart" : "mdi-heart-outline";
    },
  },
  methods: {
    onRemovePost() {
      this.$store.dispatch("posts/removePost", {
        postId: this.post.id,
      });
    },
    onToggleComment() {
      if (!this.commentOpened) {
        this.$store.dispatch("posts/loadComments", { postId: this.post.id });
      }

      this.commentOpened = !this.commentOpened;
    },
    onRetweet() {
      if (!this.me) {
        return alert("로그인이 필요합니다.");
      }

      this.$store.dispatch("posts/retweet", {
        postId: this.post.id,
      });
    },
    onClickHeart() {
      if (!this.me) {
        return alert("로그인이 필요합니다.");
      }

      if (this.liked) {
        return this.$store.dispatch("posts/unlikePost", {
          postId: this.post.id,
        });
      }

      return this.$store.dispatch("posts/likePost", {
        postId: this.post.id,
      });
    },
  },
};
</script>

<style></style>
