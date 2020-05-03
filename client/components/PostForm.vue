<template>
  <v-card style="margin-bottom: 20px;">
    <v-container>
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
        <v-textarea
          v-model="content"
          outlined
          auto-grow
          clearable
          label="어떤 신기한 일이 있었나요?"
          :hide-details="hideDetails"
          :success-messages="successMessages"
          :success="success"
          :rules="textareaRules"
          @input="onChangeTextarea"
        />

        <div :style="hideDetails ? { marginTop: '10px' } : null">
          <v-btn type="submit" color="green" absolute right style="color: #fff;">짹짹</v-btn>
          <input ref="imageInput" type="file" multiple hidden @change="onChangeImages" />
          <v-btn type="button" @click="onClickImageUpload">이미지 업로드</v-btn>
          <div>
            <p v-for="(p, i) in imagePaths" :key="p" style="display: inline-block;">
              <img :src="`http://localhost:3085/${p}`" :alt="p" style="width: 200px;" />
              <button type="button" @click="onRemoveImage(i)">제거</button>
            </p>
          </div>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      hideDetails: true,
      successMessages: "",
      success: false,
      valid: false,
      content: "",
      textareaRules: [(v) => !!v.trim() || "내용을 입력하세요."],
    };
  },
  computed: {
    ...mapState("users", ["me"]),
    ...mapState("posts", ["imagePaths"]),
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
      const { content } = this;

      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("posts/addPost", {
            content,
            image: this.imagePaths,
          })
          .then((_) => {
            this.content = "";
            this.hideDetails = false;
            this.success = true;
            this.successMessages = "게시글 등록 성공!";
          }).
          then(_ => {
            this.$store.dispatch('users/loadUser');
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    onClickImageUpload() {
      this.$refs.imageInput.click();
    },
    onChangeImages(e) {
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, (f) => {
        imageFormData.append("image", f);
      });

      this.$store.dispatch("posts/uploadImages", imageFormData);
    },
    onRemoveImage(index) {
      this.$store.commit("posts/REMOVE_IMAGE_PATHS", index);
    },
  },
};
</script>

<style></style>
