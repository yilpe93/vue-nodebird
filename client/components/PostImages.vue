<template>
  <div v-if="images.length === 0"></div>
  <div v-else-if="images.length === 1">
    <!-- contain | cover -->
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
    />
  </div>
  <div v-else-if="images.length === 2" style="display: flex;">
    <!-- contain | cover -->
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1;"
    />
    <!-- contain | cover -->
    <v-img
      :src="`http://localhost:3085/${images[1].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1;"
    />
  </div>
  <div v-else-if="images.length > 2" style="display: flex;">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
    />
    <div
      style="
        display: flex;
        flex: 1;
        align-items: center;
        justfy-content: center;
      "
    >
      <div style="display: flex; flex-direction: column; text-align: center;">
        <v-icon>mdi-dots-horizontal</v-icon>
        더보기
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style></style>
