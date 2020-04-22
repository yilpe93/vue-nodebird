<template>
  <div>
    <v-list v-if="!isEmpty">
      <ul>
        <li v-for="user in users" :key="user.id">
          <span>{{ user.nickname }}</span>
          <v-icon @click="remove(user.id)">mdi-minus-circle-outline</v-icon>
        </li>
      </ul>
    </v-list>
    <p v-else>해당 리스트가 없습니다.</p>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
    remove: {
      type: Function,
      required: true,
    },
  },
  computed: {
    isEmpty() {
      return !(this.users && this.users.length > 0);
    },
  },
  data() {
    return {
      user: {
        name: "",
        age: "",
      },
    };
  },
};
</script>

<style></style>
