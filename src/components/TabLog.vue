<template>
  <div class="row my-3">
    <div>
      <h1 class="display-2">Logbog</h1>
      <hr>
    </div>
  </div>

  <div class="row mb-3">
    <table class="table table-responsive">
      <thead class="sticky-top">
      <tr>
        <th>Dato</th>
        <th>Type</th>
        <th>Værdi</th>
      </tr>
      </thead>

      <tbody class="table-group-divider">
      <tr v-for="logLine of logLines" v-bind:key="logLine.key">
        <td>
          {{ logLine.date.toLocaleDateString() }}
        </td>
        <td>
          {{ logLine.note }}
        </td>
        <td>
          {{ formatLogLineAmount(logLine) }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {EggEventApi} from "@/util/EggEventApi";
import {
  addDays,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears
} from "date-fns";
import type {LogLine} from "@/types/LogLine";
import type {EggEventOutput} from "@/api/chicken-data";

const now = new Date();

export default defineComponent({
  name: "TabLog",
  components: {Datepicker},
  data() {
    return {
      dateRange: [startOfMonth(now), endOfMonth(now)],
      presetRanges: [
        {label: 'I dag', range: [now, now]},
        {label: 'Denne måned', range: [startOfMonth(now), endOfMonth(now)]},
        {
          label: 'Sidste måned',
          range: [startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1))]
        },
        {label: 'I år', range: [startOfYear(now), endOfYear(now)]},
        {label: 'Sidste år', range: [startOfYear(subYears(now, 1)), endOfYear(subYears(now, 1))]}
      ],
      logLines: [] as LogLine[]
    };
  },
  methods: {
    async getLogLines(): Promise<void> {
      const eggEventLogLines = await EggEventApi.getEggEvents({
        from: this.dateRange[0],
        to: addDays(this.dateRange[1], 1),
      }).then((eggEvents) => eggEvents.map((eggEvent) => this.logLineFromEggEvent(eggEvent)))

      this.logLines = eggEventLogLines.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    logLineFromEggEvent(eggEvent: EggEventOutput): LogLine {
      return {
        key: `egg-${eggEvent.id}`,
        type: "EggEvent",
        id: eggEvent.id,
        date: eggEvent.date,
        note: "Æg",
        amount: eggEvent.amount
      };
    },
    formatLogLineAmount(logLine: LogLine): string {
      if (logLine.type === "EggEvent") {
        return `${logLine.amount} stk.`
      }

      return "ikke et æg";
    }
  },
  watch: {
    dateRange() {
      this.getLogLines();
    },
  },
  mounted() {
    this.getLogLines();
  }
});
</script>

<style scoped lang="scss">
</style>
