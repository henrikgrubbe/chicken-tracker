<template>
  <DeleteEventModal :log-line="selectedLogLine" @deleted="getLogLines"></DeleteEventModal>

  <EditEggEventModal :log-line="selectedLogLine" @saved="getLogLines"></EditEggEventModal>
  <EditTransactionEventModal :log-line="selectedLogLine"
                             @saved="getLogLines"></EditTransactionEventModal>

  <div class="row my-2">
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
          <td :style="{ color: getLogLineAmountColor(logLine) }">
            {{ getFormattedLogLineAmount(logLine) }}
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-sm mb-md-0 rounded-2" type="button"
                      data-bs-toggle="modal" @click="selectedLogLine = logLine"
                      :data-bs-target="logLine.type === 'EggEvent' ? '#editEggEventModal' : '#editTransactionEventModal'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     class="bi bi-pencil" viewBox="0 0 16 16">
                  <path
                      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>

              <button class="btn btn-sm mb-md-0 rounded-2" type="button"
                      data-bs-toggle="modal" @click="selectedLogLine = logLine"
                      data-bs-target="#deleteEventModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
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
import {EggEventApi, TransactionEventApi} from "@/util/Api";
import {
  addDays,
  endOfMonth,
  endOfYear,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears
} from "date-fns";
import type {LogLine} from "@/types/LogLine";
import type {EggEventOutput, TransactionEventOutput} from "@/api/chicken-data";
import EditEggEventModal from "@/components/log/EditEggEventModal.vue";
import EditTransactionEventModal from "@/components/log/EditTransactionEventModal.vue";
import DeleteEventModal from "@/components/log/DeleteEventModal.vue";

const now = new Date();

export default defineComponent({
  name: "TabLog",
  components: {DeleteEventModal, EditTransactionEventModal, EditEggEventModal, Datepicker},
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
      const from = this.dateRange[0];
      const to = addDays(this.dateRange[1], 1);
      const promises = [];

      promises.push(
          EggEventApi.getEggEvents({from, to})
          .then((events: EggEventOutput[]) => events.map(logLineFromEggEvent)),
          TransactionEventApi.getTransactionEvents({from, to})
          .then((events: TransactionEventOutput[]) => events.map(logLineFromTransactionEvent)),
      );

      const logLines = await Promise.all(promises)
      .then((logLineLists) => Array.prototype.concat(...logLineLists))

      // Newest first
      logLines.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.logLines = logLines;

      function logLineFromEggEvent(event: EggEventOutput): LogLine {
        return {
          key: `egg-${event.id}`,
          type: "EggEvent",
          id: event.id,
          date: parseISO((event.date as unknown as string)),
          note: "Æg",
          amount: event.amount
        };
      }

      function logLineFromTransactionEvent(event: TransactionEventOutput): LogLine {
        return {
          key: `transcation-${event.id}`,
          type: "TransactionEvent",
          id: event.id,
          date: parseISO((event.date as unknown as string)),
          note: event.note,
          amount: event.amount
        };
      }
    },
    getFormattedLogLineAmount(logLine: LogLine): string {
      switch (logLine.type) {
        case "EggEvent":
          return `${logLine.amount} stk.`
        case "TransactionEvent":
          return `${logLine.amount.toFixed(2)} kr.`
      }
    },
    getLogLineAmountColor(logLine: LogLine): string {
      switch (logLine.type) {
        case "EggEvent":
          return "black";
        case "TransactionEvent":
          return logLine.amount > 0 ? "#198754" : "#dc3545";
      }
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
