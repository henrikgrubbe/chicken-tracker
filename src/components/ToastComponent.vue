<template>
  <div class="toast-container position-fixed p-3 bottom-0 start-50 translate-middle-x">
    <div ref="toast" class="toast">
      <div class="toast-header">
        <strong class="me-auto">{{ toastData?.title }}</strong>
        <small>{{ toastData?.timestamp.toLocaleTimeString() }}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ toastData?.body }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {ToastData} from "@/types/ToastData";
import {Toast} from "bootstrap";
import {ToastService} from "@/util/ToastService";

export default defineComponent({
  name: "ToastComponent",
  data() {
    return {
      toastData: undefined as ToastData | undefined
    };
  },
  mounted() {
    const toastRef = this.$refs.toast as HTMLDivElement;
    const toast = new Toast(toastRef);

    ToastService.toast$.subscribe((toastData) => {
      this.toastData = toastData;
      toast.show();
    });
  }
});
</script>


<style scoped>

</style>
