<template>
  <div class="modal fade" id="newTransactionEventModal" tabindex="-1"
       aria-labelledby="newTransactionEventModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="newTransactionEventModalLabel">
            Nyt {{ transactionType === "purchase" ? "køb" : "salg" }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="newTransactionEventModalDatepicker" class="form-label">Dato</label>
            <Datepicker id="newTransactionEventModalDatepicker" v-model="transactionEvent.date"
                        auto-apply :clearable="false"
                        :teleport-center="true" :enable-time-picker="false"/>
          </div>

          <div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="description" placeholder="Beskrivelse"
                     v-model="transactionEvent.note">
              <label for="description">Beskrivelse</label>
            </div>
            <div class="form-floating mb-3">
              <input type="number" min="0" class="form-control" id="amount" placeholder="Beløb"
                     v-model="transactionEvent.amount">
              <label for="description">Beløb</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Annuller
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                  :disabled="transactionEvent.note === undefined || transactionEvent.amount === undefined"
                  @click="saveTransactionEvent">
            Gem
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import {TransactionEventApi} from "@/util/Api";
import {ToastService} from "@/util/ToastService";
import {setHours} from "date-fns";
import Datepicker from "@vuepic/vue-datepicker";

const now = setHours(new Date(), 12);

export default defineComponent({
  name: 'NewTransactionEventModal',
  components: {Datepicker},
  props: {
    transactionType: {type: String as PropType<"purchase" | "sale">, required: true}
  },
  data() {
    return {
      transactionEvent: {
        date: now,
        note: undefined as string | undefined,
        amount: undefined as number | undefined
      },
    }
  },
  methods: {
    saveTransactionEvent(): void {
      if (this.transactionType === undefined ||
          this.transactionEvent.amount === undefined ||
          this.transactionEvent.note === undefined) {
        return;
      }

      TransactionEventApi.createTransactionEvent({
        transactionEventInput: {
          amount: this.transactionType === "purchase" ? -this.transactionEvent.amount : this.transactionEvent.amount,
          note: this.transactionEvent.note,
          date: setHours(this.transactionEvent.date, 12)
        }
      })
      .then(() => {
        ToastService.showToast({
          title: "Succes",
          body: this.transactionType === "purchase" ? "Køb gemt" : "Salg gemt",
          timestamp: new Date()
        });

        this.transactionEvent.note = undefined;
        this.transactionEvent.amount = undefined;
        this.transactionEvent.date = now;
      });
    },
  }
});
</script>

<style lang="scss" scoped>
</style>
