<template>
  <nav class="navbar navbar-expand bg-primary navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        Olympus
      </a>
      <div>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: selectedTab === Tab.INPUT }" href="#"
               @click="selectedTab = Tab.INPUT">Input</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: selectedTab === Tab.STATS }" href="#"
               @click="selectedTab = Tab.STATS">Statistik</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: selectedTab === Tab.LOG }" href="#"
               @click="selectedTab = Tab.LOG">Logbog</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <ToastComponent></ToastComponent>

  <div class="container">
    <TabInput v-if="selectedTab === Tab.INPUT"></TabInput>
    <TabStats v-if="selectedTab === Tab.STATS"></TabStats>
    <TabLog v-if="selectedTab === Tab.LOG"></TabLog>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Tab} from "@/types/Tab";
import TabLog from "@/components/TabLog.vue";
import TabInput from "@/components/TabInput.vue";
import TabStats from "@/components/TabStats.vue";
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
