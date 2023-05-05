<script lang="ts">
import {defineComponent} from "vue";
import {authInfo} from "@/composables/authInfo";

export default defineComponent({
  name: "NavbarComponent",
  components: {},
  data() {
    return {
      auth: {...authInfo()},
    };
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {
  }
});
</script>

<template>
  <nav class="navbar navbar-expand bg-primary navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        Olympus
      </a>
      <div>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/stats">Statistik</RouterLink>
          </li>
          <li class="nav-item" v-if="auth.isAuthorized">
            <RouterLink class="nav-link" to="/input">Input</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/log">Log</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/graphs">Grafer</RouterLink>
          </li>
          <li class="nav-item">
            <div v-if="auth.isLoading" class="nav-link">
              <div class="spinner-border spinner-border-sm" role="status"/>
            </div>

            <RouterLink v-else-if="auth.isAuthorized" class="nav-link" to="/auth">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-person-check-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                      d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path
                    d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
            </RouterLink>

            <RouterLink v-else class="nav-link" to="/auth">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-person-fill-exclamation" viewBox="0 0 16 16">
                <path
                    d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                <path
                    d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V11a.5.5 0 0 0-.5-.5Zm0 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"/>
              </svg>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
