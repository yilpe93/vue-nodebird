<template>
  <v-form
    ref="form"
    v-model="valid"
    style="position: relative;"
    @submit.prevent="onSubmitForm"
  >
    <v-textarea
      v-model="content"
      filled
      auto-grow
      label="댓글 달기"
      :hide-details="hideDetails"
      :success="success"
      :success-messages="successMessages"
      @input="onChangeTextarea"
    >
    </v-textarea>
    <v-btn color="green" dark absolute top right type="submit">삐약</v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    postId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      hideDetails: true,
      successMessages: "",
      success: false,
      valid: false,
      content: "",
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  methods: {
    onChangeTextarea(value) {
      if (value && value.length) {
        this.hideDetails = true;
        this.success = false;
        this.successMessages = "";
      }
    },
    onSubmitForm() {
      if (this.$refs.form.validate()) {
        const { postId, content } = this;

        this.$store
          .dispatch("posts/addComment", {
            id: Date.now(),
            postId,
            content,
            User: {
              nickname: this.me.nickname,
            },
          })
          .then((_) => {
            this.content = "";
            this.success = true;
            this.hideDetails = false;
            this.successMessages = "댓글이 작성되었습니다.";
          })
          .catch((err) => console.log("err", err));
      }
    },
  },
};
</script>

<style></style>
