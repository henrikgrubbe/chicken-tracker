<script lang="ts">
import '@passageidentity/passage-elements/passage-login'
import {PassageUser} from '@passageidentity/passage-elements/passage-user';

import {defineComponent} from "vue";

export default defineComponent({
  name: "AuthView",
  data() {
    return {
      appId: import.meta.env.VITE_PASSAGE_APP_ID
    };
  },
  methods: {
    async signOut() {
      const user = new PassageUser()
      await user.signOut();
    }
  },
  mounted() {
  }
});
</script>

<template>
  <div class="authContainer">
    <passage-login :app-id="appId"></passage-login>
  </div>
</template>


<style scoped>
</style>