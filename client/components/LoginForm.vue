<template>
  <v-container v-if="!me">
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
        <v-container>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="이메일"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="비밀번호"
            type="password"
            required
          />

          <div class="btn-group">
            <v-btn color="green" type="submit" :disabled="!valid">로그인</v-btn>
            <v-btn nuxt to="signup">회원가입</v-btn>
          </div>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-card>
      <v-container>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          {{ me.nickname }}님 로그인되었습니다.
          <v-btn @click="onLogOut">로그아웃</v-btn>
        </div>
        <div>
          <v-row>
            <v-col cols="4">{{ me.Followings.length }} 팔로잉</v-col>
            <v-col cols="4">{{ me.Followers.length }} 팔로워</v-col>
            <v-col cols="4">{{ me.Posts.length }} 게시글</v-col>
          </v-row>
        </div>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "이메일은 필수입니다.",
        (v) => /.+@.+/.test(v) || "이메일이 유효하지 않습니다.",
      ],
      passwordRules: [(v) => !!v || "패스워드는 필수입니다."],
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  methods: {
    onSubmitForm() {
      const { email, password } = this;

      if (this.$refs.form.validate()) {
        this.$store.dispatch("users/logIn", {
          email,
          password,
        });
      }
    },
    onLogOut() {
      this.$store.dispatch("users/logOut").then((_) => {
        this.email = "";
        this.password = "";
        this.$router.push({ path: "/" });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;

  > button {
    color: #fff;
  }
  > a {
    margin-left: 10px;
  }
}
</style>
