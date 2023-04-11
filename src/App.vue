<template>
  <nav class="navbar navbar-expand bg-primary navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        Olympus
      </a>
      <div>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Input</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/stats">Statistik</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/log">Log</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <ToastComponent></ToastComponent>

  <div class="container">
    <RouterView/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Tab} from "@/types/Tab";
import TabLog from "@/components/log/LogView.vue";
import TabInput from "@/components/input/InputView.vue";
import TabStats from "@/components/stats/StatsView.vue";
import ToastComponent from "@/components/ToastComponent.vue";

export default defineComponent({
  components: {ToastComponent, TabInput, TabStats, TabLog},
  data() {
    return {
      Tab,
      selectedTab: Tab.INPUT as Tab,
    };
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {
  }
});
</script>


<style scoped lang="scss">

</style>
