<template>
  <v-app>
    <nav>
      <v-toolbar dark color="green">
        <v-toolbar-title>
          <nuxt-link to="/">NodeBird</nuxt-link>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-text-field
            label="검색"
            hide-details
            prepend-icon="mdi-magnify"
            class="search-field"
          />
          <v-btn text nuxt to="/profile">
            <span>프로필</span>
          </v-btn>
          <v-btn text nuxt to="/signup">
            <span>회원가입</span>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </nav>

    <v-row no-gutters>
      <v-col cols="12" md="4">
        <LoginForm />
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
};
</script>

<style lang="scss" scoped>
.search-field {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
