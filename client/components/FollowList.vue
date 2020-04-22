<template>
  <div>
    <v-list v-if="!isEmpty">
      <ul>
        <li v-for="(list, index) in lists" :key="index">
          <span>{{ list }}</span>
          <v-icon @click="removeEvent(index)">mdi-minus-circle-outline</v-icon>
        </li>
      </ul>
    </v-list>
    <p v-else>해당 리스트가 없습니다.</p>
  </div>
</template>

<script>
export default {
  props: {
    statusName: String,
    lists: {
      type: Array,
    },
    removeEvent: Function,
  },
  computed: {
    isEmpty() {
      return !(this.lists && this.lists.length);
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
