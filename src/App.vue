<template>
  <NavbarComponent/>

  <ToastComponent></ToastComponent>

  <div class="container">
    <RouterView/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ToastComponent from "@/components/ToastComponent.vue";
import NavbarComponent from "@/components/NavbarComponent.vue";


export default defineComponent({
  components: {NavbarComponent, ToastComponent},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {
  }
});
</script>


