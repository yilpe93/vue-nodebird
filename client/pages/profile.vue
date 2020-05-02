<template>
  <v-container>
    <v-card style="margin-bottom: 20px;">
      <v-container>
        <v-subheader>내 프로필</v-subheader>
      </v-container>
      <v-container>
        <v-form v-model="valid" @submit.prevent="onChangeNickname">
          <v-text-field
            v-model="nickname"
            label="닉네임"
            :rules="nicknameRules"
            reuqired
          />
          <v-btn dark color="blue" type="submit">수정</v-btn>
        </v-form>
      </v-container>
    </v-card>

    <v-card style="margin-bottom: 20px;">
      <v-container>
        <v-subheader>팔로잉</v-subheader>
        <follow-list :users="followingList" :remove="removeFollowing" />
        <v-btn
          v-if="hasMoreFollowing"
          dark
          color="blue"
          style="width: 100%;"
          @click="loadMoreFollowing"
          >더보기</v-btn
        >
      </v-container>
    </v-card>

    <v-card style="margin-bottom: 20px;">
      <v-container>
        <v-subheader>팔로워</v-subheader>
        <follow-list :users="followerList" :remove="removeFollower" />
        <v-btn
          v-if="hasMoreFollower"
          dark
          color="blue"
          style="width: 100%;"
          @click="loadMoreFollower"
          >더보기</v-btn
        >
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
const FollowList = () => import("~/components/FollowList");

export default {
  components: {
    FollowList,
  },
  head() {
    return {
      title: "프로필",
    };
  },
  middleware: "anonymous",
  data() {
    return {
      modefied: false,
      valid: false,
      nickname: "",
      nicknameRules: [(v) => !!v || "닉네임을 입력하세요."],
    };
  },
  computed: {
    followingList() {
      return this.$store.state.users.followingList;
    },
    followerList() {
      return this.$store.state.users.followerList;
    },
    hasMoreFollowing() {
      return this.$store.state.users.followingList;
    },
    hasMoreFollower() {
      return this.$store.state.users.followerList;
    },
  },
  fetch({ store }) {
    store.dispatch("users/loadFollowing");
    return store.dispatch("users/loadFollower");
  },
  methods: {
    onChangeNickname() {
      this.$store.dispatch("users/changeNickname", {
        nickname: this.nickname,
      });
    },
    removeFollowing(id) {
      this.$store.dispatch("users/removeFollowing", id);
    },
    removeFollower(id) {
      this.$store.dispatch("users/removeFollower", id);
    },
    loadMoreFollowing() {
      this.$store.dispatch("users/loadFollowing");
    },
    loadMoreFollower() {
      this.$store.dispatch("users/loadFollower");
    },
  },
};
</script>

<style></style>
