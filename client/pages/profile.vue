<template>
  <v-container>
    <v-card style="margin-bottom: 20px;">
      <v-container>
        <v-subheader>내 프로필</v-subheader>
      </v-container>
      <v-container>
        <v-form>
          <v-text-field label="닉네임" reuqired />
          <v-btn color="blue" type="submit">수정</v-btn>
        </v-form>
      </v-container>
    </v-card>
    <v-card style="margin-bottom: 20px;">
      <v-container>
        <v-subheader>팔로잉</v-subheader>
        <follow-list />
      </v-container>
    </v-card>
    <v-card style="margin-bottom: 20px;">
      <v-container>
        <v-subheader>팔로워</v-subheader>
        <follow-list />
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
};
</script>

<style></style>
