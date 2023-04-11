<template>
  <NewTransactionEventModal :transaction-type="transactionType"></NewTransactionEventModal>


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
import {EggEventApi} from "@/util/Api";
import {setHours} from "date-fns";
import NewTransactionEventModal from "@/components/input/NewTransactionEventModal.vue";

const now = setHours(new Date(), 12);


export default defineComponent({
  name: "InputView",
  components: {NewTransactionEventModal, Datepicker},
  data() {
    return {
      date: now,
      numEggs: 1 as number,
      transactionType: "purchase" as "purchase" | "sale",
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
