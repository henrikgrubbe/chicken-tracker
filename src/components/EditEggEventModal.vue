<template>
  <div class="modal fade" id="editEggEventModal" tabindex="-1"
       aria-labelledby="editEggEventModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editEggEventModalLabel">
            Rediger æg
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editEggEventModalDatepicker" class="form-label">Dato</label>
            <Datepicker id="editEggEventModalDatepicker" v-model="eggEvent.date"
                        auto-apply :clearable="false"
                        :teleport-center="true" :enable-time-picker="false"/>
          </div>

          <div>
            <label for="editEggEventModalAmount" class="form-label">Antal</label>
            <div class="input-group input-group-lg egg-input">
              <button class="btn btn-outline-secondary" type="button"
                      @click="eggEvent.amount--" :disabled="eggEvent.amount === 1">
                -
              </button>
              <input type="number" min="1" class="form-control text-center"
                     id="editEggEventModalAmount"
                     v-model="eggEvent.amount">
              <button class="btn btn-outline-secondary" type="button"
                      @click="eggEvent.amount++">
                +
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Annuller
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                  :disabled="noChanges" @click="saveEggEvent">
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
import {EggEventApi} from "@/util/EggEventApi";
import {ToastService} from "@/util/ToastService";
import {differenceInDays} from "date-fns";

const defaultEggEvent = {
  id: -1,
  amount: 1,
  date: new Date(),
};

export default defineComponent({
  name: 'EditEggEventModal',
  components: {Datepicker},
  props: {
    logLine: {type: Object as PropType<LogLine>, required: false}
  },
  data() {
    return {
      eggEvent: defaultEggEvent
    }
  },
  methods: {
    reset(): void {
      this.eggEvent = defaultEggEvent;
    },
    setEggEvent(): void {
      // Hacky, but event is fired before logline is set
      setTimeout(() => {
        this.eggEvent = {
          id: this.logLine!.id,
          date: this.logLine!.date,
          amount: this.logLine!.amount,
        };
      }, 5);
    },
    saveEggEvent(): void {
      if (this.logLine === undefined) {
        return;
      }

      EggEventApi.putEggEvent({
        id: this.logLine.id,
        eggEventInput: {
          amount: this.eggEvent.amount,
          date: this.eggEvent.date
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

      return differenceInDays(this.logLine.date, this.eggEvent.date) === 0
          && this.logLine.amount === this.eggEvent.amount;
    }
  },
  mounted() {
    (this.$refs.modal as HTMLDivElement).addEventListener('hidden.bs.modal', this.reset);
    (this.$refs.modal as HTMLDivElement).addEventListener('show.bs.modal', this.setEggEvent);
  },
  beforeUnmount() {
    (this.$refs.modal as HTMLDivElement).removeEventListener('hidden.bs.modal', this.reset);
    (this.$refs.modal as HTMLDivElement).removeEventListener('show.bs.modal', this.setEggEvent);
  }
});
</script>

<style lang="scss" scoped>
</style>
