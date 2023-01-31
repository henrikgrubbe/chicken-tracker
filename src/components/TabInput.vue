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


  <div class="row my-2">
    <div>
      <h1 class="display-2">Input</h1>
      <hr>
    </div>
  </div>

  <div class="row mb-3">
    <form>
      <div>
        <Datepicker v-model="date" auto-apply :clearable="false"
                    :teleport-center="true" :enable-time-picker="false"/>
      </div>
    </form>
  </div>

  <div class="row mb-4">
    <h2>Æg</h2>
    <form @submit.prevent="saveEggEvent()">
      <div class="input-group input-group-lg mb-3 egg-input">
        <button class="btn btn-outline-secondary" type="button"
                @click="numEggs--" :disabled="numEggs === 1">
          -
        </button>
        <input type="number" min="1" class="form-control text-center" v-model="numEggs">
        <button class="btn btn-outline-secondary" type="button"
                @click="numEggs++">
          +
        </button>
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="submit">Tilføj</button>
      </div>
    </form>
  </div>

  <div class="row mb-4">
    <h2>Køb & salg</h2>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
              @click="transactionType = 'purchase'"
              data-bs-target="#newTransactionEventModal">
        Nyt køb
      </button>
      <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
              @click="transactionType = 'sale'"
              data-bs-target="#newTransactionEventModal">
        Nyt salg
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ToastService} from "@/util/ToastService";
import {EggEventApi, TransactionEventApi} from "@/util/Api";
import {setHours} from "date-fns";

const now = setHours(new Date(), 12);


export default defineComponent({
  name: "TabInput",
  components: {Datepicker},
  data() {
    return {
      date: now,
      numEggs: 1 as number,
      transactionType: undefined as "purchase" | "sale" | undefined,
      transactionEvent: {
        date: now,
        note: undefined as string | undefined,
        amount: undefined as number | undefined
      },
    };
  },
  methods: {
    saveEggEvent(): void {
      EggEventApi.createEggEvent({
        eggEventInput: {
          amount: this.numEggs,
          date: setHours(this.date, 12)
        }
      })
      .then(() => {
        ToastService.showToast({
          title: "Succes",
          body: "Æg gemt",
          timestamp: new Date()
        });

        this.numEggs = 1;
      });
    },
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
    }
  }
});
</script>

<style scoped lang="scss">
.egg-input {
  button, input {
    font-size: 1.75rem !important;
    line-height: 1.75rem !important;
  }
}
</style>
