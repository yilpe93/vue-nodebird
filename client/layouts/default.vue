<template>
  <v-app>
    <nav>
      <v-toolbar dark color="green">
        <v-toolbar-title>
          <nuxt-link to="/">NodeBird</nuxt-link>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-form @submit.prevent="onSearchHashtag">
            <div
              :style="{ display: 'flex', alignItems: 'center', height: '100%' }"
            >
              <v-text-field
                v-model="hashtag"
                label="검색"
                hide-details
                prepend-icon="mdi-magnify"
                class="search-field"
              />
            </div>
          </v-form>
          <v-btn v-if="me" text nuxt to="/profile">
            <span>프로필</span>
          </v-btn>
          <v-btn v-if="!me" text nuxt to="/signup">
            <span>회원가입</span>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </nav>

    <v-row no-gutters>
      <v-col cols="12" md="4">
        <login-form />
      </v-col>
      <v-col cols="12" md="8">
        <nuxt />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
// Lazy Loading
const LoginForm = () => import("~/components/LoginForm");

export default {
  components: {
    LoginForm,
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  data() {
    return {
      hashtag: "",
    };
  },
  methods: {
    onSearchHashtag() {
      this.$router.push({
        path: `/hashtag/${this.hashtag}`,
      });
      this.hashtag = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.row {
  flex: none;
}

.search-field {
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
