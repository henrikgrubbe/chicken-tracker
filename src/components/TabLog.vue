<template>
  <EditEggEventModal :log-line="selectedLogLine" @saved="getLogLines"></EditEggEventModal>

  <div class="row my-3">
    <div>
      <h1 class="display-2">Logbog</h1>
      <hr>
    </div>
  </div>

  <div class="row mb-3">
    <Datepicker v-model="dateRange" auto-apply :clearable="false" :teleport-center="true"
                :enable-time-picker="false" :preset-ranges="presetRanges" range/>
  </div>

  <div class="row mb-3">
    <div>
      <table class="table align-middle">
        <thead class="sticky-top">
        <tr>
          <th scope="col">Dato</th>
          <th scope="col">Type</th>
          <th scope="col">Værdi</th>
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
          <td>
            <button class="btn btn-sm mb-md-0 rounded-2" type="button"
                    data-bs-toggle="modal" data-bs-target="#editEggEventModal"
                    @click="selectedLogLine = logLine">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-pencil" viewBox="0 0 16 16">
                <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
import EditEggEventModal from "@/components/EditEggEventModal.vue";

const now = new Date();

export default defineComponent({
  name: "TabLog",
  components: {EditEggEventModal, Datepicker},
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
        {label: 'Sidste år', range: [startOfYear(subYears(now, 1)), endOfYear(subYears(now, 1))]},
        {label: 'Altid', range: [new Date(Date.UTC(2000, 0)), new Date(Date.UTC(2050, 0))]}
      ],
      logLines: [] as LogLine[],
      selectedLogLine: undefined as LogLine | undefined
    };
  },
  methods: {
    async getLogLines(): Promise<void> {
      const eggEventLogLines = await EggEventApi.getEggEvents({
        from: this.dateRange[0],
        to: addDays(this.dateRange[1], 1),
      }).then((eggEvents) => eggEvents.map(logLineFromEggEvent))

      // Newest first
      eggEventLogLines.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.logLines = eggEventLogLines;


      function logLineFromEggEvent(eggEvent: EggEventOutput): LogLine {
        return {
          key: `egg-${eggEvent.id}`,
          type: "EggEvent",
          id: eggEvent.id,
          date: eggEvent.date,
          note: "Æg",
          amount: eggEvent.amount
        };
      }
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
