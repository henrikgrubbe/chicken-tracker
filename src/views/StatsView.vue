<template>
  <div class="row my-2">
    <div>
      <h1 class="display-2">Statistik</h1>
      <hr>
    </div>
  </div>

  <div class="row mb-3">
    <Datepicker v-model="dateRange" auto-apply :clearable="false" :teleport-center="true"
                :enable-time-picker="false" :preset-ranges="presetRanges" range/>
  </div>

  <div class="row mb-3">
    <div>
      <ul class="list-group">
        <li class="list-group-item list-group-item-action" v-for="item of items"
            v-bind:key="item.title">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ item.title }}</h5>
          </div>
          <p class="mb-1">{{ item.data }}</p>
          <small>{{ item.description }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import '@vuepic/vue-datepicker/dist/main.css';
import {
  addDays,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
  differenceInDays,
  min
} from "date-fns";
import type {StatisticsItem} from "@/types/StatisticsItem";
import {StatisticsApi} from "@/util/Api";

const now = new Date();

export default defineComponent({
  name: "StatsView",
  components: {Datepicker},
  data() {
    return {
      dateRange: [startOfYear(now), endOfYear(now)],
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
      items: [] as StatisticsItem[],
    };
  },
  methods: {
    async getStatisticsData(): Promise<void> {
      const from = this.dateRange[0];
      const to = addDays(this.dateRange[1], 1);

      const result = (await StatisticsApi.getStats({from, to}))[0];
      const numberOfDays = this.calculateNumberDays(from, to, result.daysWithChickens);

      this.items = [
        {
          title: "Udgifter",
          data: this.formatCurrency(result.expenses),
          description: "Total udgift gennem den valgte periode"
        },
        {
          title: "Indtægter",
          data: this.formatCurrency(result.income),
          description: "Total indtægt fra salg gennem den valgte periode"
        },
        {
          title: "Sparet",
          data: this.formatCurrency(result.saved),
          description: "Totalt beløb sparet på æg gennem den valgte periode"
        },
        {
          title: "Balance",
          data: this.formatCurrency(result.balance),
          description: "Endeligt resultat for den valgte periode"
        },
        {
          title: "Antal æg",
          data: `${result.numberOfEggs} æg`,
          description: "Antal æg for den valgte periode"
        },
        {
          title: "Æg per dag",
          data: `${(result.numberOfEggs / numberOfDays).toFixed(2)} æg`,
          description: "Antal æg per dag i den valgte periode"
        },
        {
          title: "Pris per æg",
          data: this.formatCurrency(result.pricePerEgg),
          description: "Pris per æg i den valgte periode"
        },
        {
          title: "Pris for næste æg",
          data: this.formatCurrency(result.priceForNextEgg),
          description: "Pris for næste æg indenfor den valgte periode"
        },
        {
          title: "Dage med høns i alt",
          data: `${result.daysWithChickens} dage`,
          description: "Totalt antal dage med høns"
        },
      ]
    },
    calculateNumberDays(from: Date, to: Date, totalDays: number) {
      return Math.min(totalDays, differenceInDays(min([to, now]), from));
    },
    formatCurrency(input?: number): string | undefined {
      if (input == null) {
        return undefined;
      }

      return input.toLocaleString('da-dk', {currency: 'DKK', style: 'currency'});
    },
  },
  watch: {
    dateRange() {
      this.getStatisticsData();
    },
  },
  mounted() {
    this.getStatisticsData();
  }
});
</script>

<style scoped lang="scss">
</style>
