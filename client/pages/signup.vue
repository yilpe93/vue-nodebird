<template>
  <v-container>
    <v-card>
      <v-container>
        <v-subheader>회원가입</v-subheader>
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
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
          <v-text-field
            v-model="passwordCheck"
            :rules="passwordCheckRules"
            label="비밀번호 확인"
            type="password"
            required
          />
          <v-text-field
            v-model="nickname"
            :rules="nicknameRules"
            label="닉네임"
            type="nickname"
            required
          />
          <v-checkbox
            v-model="terms"
            :rules="[(v) => !!v || '약관에 동의하셔야 합니다.']"
            label="약관에 동의합니다."
            required
          />
          <v-btn
            color="green"
            type="submit"
            :disabled="!valid"
            :style="{ color: !valid ? 'inherit' : '#fff' }"
          >
            가입하기
          </v-btn>
        </v-form>
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
      passwordCheck: "",
      nickname: "",
      terms: false,
      emailRules: [
        (v) => !!v || "이메일은 필수입니다.",
        (v) => /.+@.+/.test(v) || "이메일이 유효하지 않습니다.",
      ],
      passwordRules: [(v) => !!v || "패스워드는 필수입니다."],
      passwordCheckRules: [
        (v) => !!v || "패스워드 확인은 필수입니다.",
        (v) => v === this.password || "비밀번호가 일치하지 않습니다.",
      ],
      nicknameRules: [(v) => !!v || "닉네임은 필수입니다."],
      // termsRules: "",
    };
  },
  methods: {
    onSubmitForm() {
      const { nickname, email } = this;

      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("users/signUp", { nickname, email })
          .then((_) => {
            this.$router.push({ path: "/" });
          })
          .catch((_) => {
            alert("회원가입 실패");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
