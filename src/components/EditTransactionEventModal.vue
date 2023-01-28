<template>
  <div class="modal fade" id="editTransactionEventModal" tabindex="-1"
       aria-labelledby="editTransactionEventModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editTransactionEventModalLabel">
            Rediger
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editTransactionEventModalDatepicker" class="form-label">Dato</label>
            <Datepicker id="editTransactionEventModalDatepicker" v-model="event.date"
                        auto-apply :clearable="false"
                        :teleport-center="true" :enable-time-picker="false"/>
          </div>

          <div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="description" placeholder="Beskrivelse"
                     v-model="event.note">
              <label for="description">Beskrivelse</label>
            </div>
            <div class="form-floating mb-3">
              <input type="number" min="0" class="form-control" id="amount" placeholder="kr."
                     v-model="event.amount">
              <label for="description">Beløb</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Annuller
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                  :disabled="noChanges" @click="saveEvent">
            Gem
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import type {LogLine} from "@/types/LogLine";
import Datepicker from "@vuepic/vue-datepicker";
import {TransactionEventApi} from "@/util/Api";
import {ToastService} from "@/util/ToastService";
import {differenceInDays} from "date-fns";

const defaultEvent = {
  id: -1,
  amount: undefined as undefined | number,
  note: undefined as undefined | string,
  date: new Date(),
};

export default defineComponent({
  name: 'EditTransactionEventModal',
  components: {Datepicker},
  props: {
    logLine: {type: Object as PropType<LogLine>, required: false}
  },
  data() {
    return {
      event: defaultEvent
    }
  },
  methods: {
    reset(): void {
      this.event = defaultEvent;
    },
    setEvent(): void {
      // Hacky, but event is fired before logline is set
      setTimeout(() => {
        this.event = {
          id: this.logLine!.id,
          amount: this.logLine!.amount,
          note: this.logLine!.note,
          date: this.logLine!.date,
        };
      }, 5);
    },
    saveEvent(): void {
      if (this.logLine === undefined ||
          this.event.amount === undefined ||
          this.event.note === undefined) {
        return;
      }

      TransactionEventApi.putTransactionEvent({
        id: this.logLine.id,
        transactionEventInput: {
          amount: this.event.amount,
          note: this.event.note,
          date: this.event.date
        }
      })
      .then((_) => {
        ToastService.showToast({
          title: "Succes",
          body: "Opdateret",
          timestamp: new Date()
        });

        this.$emit('saved')
      })
    },
  },
  computed: {
    noChanges(): boolean {
      if (this.logLine === undefined) {
        return true;
      }

      return differenceInDays(this.logLine.date, this.event.date) === 0
          && this.logLine.amount === this.event.amount
          && this.logLine.note === this.event.note;
    }
  },
  mounted() {
    (this.$refs.modal as HTMLDivElement).addEventListener('hidden.bs.modal', this.reset);
    (this.$refs.modal as HTMLDivElement).addEventListener('show.bs.modal', this.setEvent);
  },
  beforeUnmount() {
    (this.$refs.modal as HTMLDivElement).removeEventListener('hidden.bs.modal', this.reset);
    (this.$refs.modal as HTMLDivElement).removeEventListener('show.bs.modal', this.setEvent);
  }
});
</script>

<style lang="scss" scoped>
</style>
