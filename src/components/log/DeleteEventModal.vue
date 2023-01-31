<template>
  <div class="modal fade" id="deleteEventModal" tabindex="-1"
       aria-labelledby="deleteEventModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteEventModalLabel">
            Bekræft sletning
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="logLine?.type === 'EggEvent'">
            <p>
              Æg, {{ logLine?.amount}} stk, fra d. {{ logLine?.date?.toLocaleDateString() }}
            </p>
          </div>
          <div v-if="logLine?.type === 'TransactionEvent'">
            <p>
              {{ logLine?.note }}, {{ logLine?.amount}} kr. fra fra d. {{ logLine?.date?.toLocaleDateString() }}
            </p>
          </div>
          <p>
            Er du sikker?
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Annuller
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                  @click="deleteEvent">
            Slet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import type {LogLine} from "@/types/LogLine";
import {EggEventApi, TransactionEventApi} from "@/util/Api";
import {ToastService} from "@/util/ToastService";

export default defineComponent({
  name: 'DeleteEventModal',
  props: {
    logLine: {type: Object as PropType<LogLine>, required: false}
  },
  data() {
    return {}
  },
  methods: {
    getTypeText(logLine: LogLine | undefined): string | undefined {
      if (logLine === undefined) {
        return;
      }

      if (logLine.type === "EggEvent") {
        return "Æg";
      }

      if (logLine.type === "TransactionEvent") {
        if (logLine.amount > 0) {
          return "Salg";
        } else {
          return "Køb";
        }
      }
    },
    deleteEvent(): void {
      if (this.logLine === undefined) {
        return;
      }

      let promise;
      if (this.logLine.type === "EggEvent") {
        promise = EggEventApi.deleteEggEvent({
          id: this.logLine.id,
        });
      } else {
        promise = TransactionEventApi.deleteTransactionEvent({
          id: this.logLine.id,
        });
      }

      promise.then(() => {
        ToastService.showToast({
          title: "Succes",
          body: `${this.getTypeText(this.logLine)} slettet`,
          timestamp: new Date()
        });

        this.$emit('deleted')
      })

    },
  }
});
</script>

<style lang="scss" scoped>
</style>
