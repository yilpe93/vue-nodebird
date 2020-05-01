<template>
  <div v-if="images.length === 0"></div>
  <div v-else-if="images.length === 1">
    <!-- contain | cover -->
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      @click="zoomImages"
    />
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
  <div v-else-if="images.length === 2" style="display: flex;">
    <!-- contain | cover -->
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1;"
      @click="zoomImages"
    />
    <!-- contain | cover -->
    <v-img
      :src="`http://localhost:3085/${images[1].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1;"
      @click="zoomImages"
    />
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
  <div v-else-if="images.length > 2" style="display: flex;">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      @click="zoomImages"
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
        <span @click="zoomImages" style="cursor: pointer;">더보기</span>
      </div>
    </div>
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
</template>

<script>
const ImageZoom = () => import("~/components/ImageZoom");

export default {
  components: {
    ImageZoom,
  },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      imageZoomed: false,
    };
  },
  methods: {
    closeModal() {
      this.imageZoomed = false;
    },
    zoomImages() {
      this.imageZoomed = true;
    },
  },
};
</script>

<style lang="scss" scpoed>
.v-image__image {
  cursor: pointer;
}
</style>
