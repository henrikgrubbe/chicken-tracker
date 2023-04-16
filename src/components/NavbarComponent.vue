<script lang="ts">
import {defineComponent} from "vue";
import ToastComponent from "@/components/ToastComponent.vue";

export default defineComponent({
  name: "NavbarComponent",
  components: {},
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

<template>
  <nav class="navbar navbar-expand bg-primary navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        Olympus
      </a>
      <div>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/stats">Statistik</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/input">Input</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/log">Log</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/auth">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
