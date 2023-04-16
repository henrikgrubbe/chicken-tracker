<script lang="ts">
import '@passageidentity/passage-elements/passage-login'
import '@passageidentity/passage-elements/passage-profile';
import {PassageUser} from '@passageidentity/passage-elements/passage-user';

import {defineComponent} from "vue";

export default defineComponent({
  name: "AuthView",
  data() {
    return {
      appId: import.meta.env.VITE_PASSAGE_APP_ID,
      signedIn: false as boolean,
    };
  },
  methods: {
    async setSignedIn(): Promise<void> {
      try {
        const signedIn = await new PassageUser().authGuard();
        this.signedIn = signedIn;
      } catch (error) {
        this.signedIn = false;
      }
    },
    async signOut(): Promise<void> {
      const user = new PassageUser();
      await user.signOut();
      await this.setSignedIn();
    },
  },
  mounted() {
    this.setSignedIn();
  }
});
</script>

<template>
  <div class="authContainer">
    <passage-login v-if="!signedIn" :app-id="appId" default-country-code="DK"/>

    <div v-else>
      <passage-profile :app-id="appId" default-country-code="DK" />
      <div class="d-flex justify-content-center mt-2">
          <button class="btn btn-outline-primary" @click="signOut">Log ud</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>