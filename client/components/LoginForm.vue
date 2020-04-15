<template>
  <v-container>
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
  methods: {
    onSubmitForm() {
      if (!this.$refs.form.validate()) {
        alert("폼 유형이 유효하지 않습니다.");
      } else {
        alert("회원가입 시도");
      }
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
