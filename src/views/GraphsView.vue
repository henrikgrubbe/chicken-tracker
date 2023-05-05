<template>
  <div class="row my-2">
    <div>
      <h1 class="display-2">Grafer</h1>
      <hr>
    </div>
  </div>

  <div class="row mb-3">
    <div>
      <Bar
          id="my-chart-id"
          :options="monthly.chartOptions"
          :data="monthly.chartData"
      />
    </div>
  </div>

  <div class="row mb-3">
    <div>
      <Bar
          id="my-chart-id"
          :options="daily.chartOptions"
          :data="daily.chartData"
      />
    </div>
  </div>
</template>


<script lang="ts">
import {defineComponent} from "vue";
import '@vuepic/vue-datepicker/dist/main.css';
import {addDays, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear} from "date-fns";
import {StatisticsApi} from "@/util/Api";
import {Bar} from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import type {StatisticsOutput} from "@/api/chicken-data";

type ChartData = {
  x: Date,
  xDisplay: string,
  y: number
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const now = startOfDay(new Date());

export default defineComponent({
  name: "GraphsView",
  components: {Bar},
  data() {
    return {
      monthly: {
        chartData: {
          datasets: []
        },
        chartOptions: {
          responsive: true,
          backgroundColor: [
            '#13795b',
          ],
          onClick: this.monthClicked,
          parsing: {
            xAxisKey: 'xDisplay'
          }
        },
      },
      daily: {
        chartData: {
          datasets: []
        },
        chartOptions: {
          responsive: true,
          backgroundColor: [
            '#13795b',
          ],
        },
      }

    };
  },
  methods: {
    async getMonthly(): Promise<void> {
      const from = addDays(startOfYear(now), 1);
      const to = addDays(endOfYear(now), 1);

      const data = await StatisticsApi.getStats({from, to, unit: "MONTH"})
      .then((result) =>
          result.map((result) =>
              this.chartDataFromStatisticsOutput(
                  result,
                  (date) => date.toLocaleString('da-DK', {month: 'long'})
              )));

      this.monthly.chartData = {
        datasets: [
          {
            label: 'Antal æg',
            data
          }
        ]
      };
    },
    chartDataFromStatisticsOutput(result: StatisticsOutput, displayFn: (date) => string): ChartData {
      const date = new Date(result.from);

      return {
        x: date,
        xDisplay: displayFn(date),
        y: result.numberOfEggs
      }
    },
    monthClicked(event, elements, chart): void {
      if (elements == null || elements.length === 0) {
        return;
      }

      const dataset = elements[0].datasetIndex;
      const index = elements[0].index;

      const dataPoint: ChartData = chart.data.datasets[dataset].data[index];
      this.getDaily(addDays(startOfMonth(dataPoint.x), 1), addDays(endOfMonth(dataPoint.x), 1));
    },
    async getDaily(from: Date, to: Date): Promise<void> {
      const data = await StatisticsApi.getStats({from, to, unit: "DAY"})
      .then((result) =>
          result.map((result) =>
              this.chartDataFromStatisticsOutput(
                  result,
                  (date) => date.toLocaleString('da-DK', {day: 'numeric'})
              )));

      this.daily.chartData = {
        datasets: [
          {
            label: 'Antal æg',
            data
          }
        ]
      };
    },
  },
  watch: {},
  mounted() {
    this.getMonthly();
  }
});
</script>

<style scoped lang="scss">
</style>
