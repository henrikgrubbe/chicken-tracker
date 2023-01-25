<template>
  <div class="row my-3">
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

  <div class="row mb-5">
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

  <div class="row">
    <h2>Køb og salg</h2>
    <form @submit.prevent="saveTransaction()">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="description" placeholder="Beskrivelse"
               v-model="note">
        <label for="description">Beskrivelse</label>
      </div>
      <div class="form-floating mb-3">
        <input type="number" min="0" class="form-control" id="amount" placeholder="kr."
               v-model="amount">
        <label for="description">Beløb</label>
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="submit"
                :disabled="note === undefined || amount === undefined">Tilføj
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ToastService} from "@/util/ToastService";
import {EggEventApi} from "@/util/EggEventApi";

const now = new Date();

export default defineComponent({
  name: "TabInput",
  components: {Datepicker},
  data() {
    return {
      date: now,
      numEggs: 1 as number,
      note: undefined as string | undefined,
      amount: undefined as number | undefined
    };
  },
  methods: {
    saveEggEvent(): void {
      EggEventApi.createEggEvent({
        eggEventInput: {
          amount: this.numEggs,
          date: this.date
        }
      })
      .then((_) => {
        ToastService.showToast({
          title: "Succes",
          body: "Input gemt",
          timestamp: new Date()
        });

        this.numEggs = 1;
      })
    },
    saveTransaction(): void {
      ToastService.showToast({
        title: "Succes",
        body: "Input gemt",
        timestamp: new Date()
      });

      this.note = undefined;
      this.amount = undefined;
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
