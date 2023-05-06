<template>
  <div class="row my-2">
    <div>
      <h1 class="display-2">Grafer</h1>
      <hr>
    </div>
  </div>

  <div class="row mb-3">
    <div>
      <Bar :options="monthly.chartOptions" :data="monthly.chartData"/>
    </div>
  </div>

  <div class="row mb-3">
    <div>
      <Bar :options="daily.chartOptions" :data="daily.chartData"/>
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
  type ActiveElement,
  BarElement,
  CategoryScale,
  Chart,
  Chart as ChartJS,
  type ChartEvent,
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
          datasets: [] as any[]
        },
        chartOptions: {
          responsive: true,
          backgroundColor: '#13795b',
          onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart<any, any[], any>) => {
            if (elements.length === 0) {
              return;
            }
            this.monthClicked(elements[0], chart);
          },
          parsing: {
            xAxisKey: 'xDisplay'
          },
          borderRadius: 2,
          plugins: {
            title: {
              display: true,
              text: 'Æg per måned'
            },
            legend: {
              display: false
            },
          }
        },
      },
      selectedMonth: {
        from: addDays(startOfMonth(now), 1),
        to: addDays(endOfMonth(now), 1)
      },
      daily: {
        chartData: {
          datasets: [] as any[]
        },
        chartOptions: {
          responsive: true,
          backgroundColor: '#13795b',
          parsing: {
            xAxisKey: 'xDisplay'
          },
          borderRadius: 2,
          scales: {
            y: {
              min: 0,
              max: 8,
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Æg per dag'
            },
            legend: {
              display: false
            },
          }
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
                      (date) => date.toLocaleString('da-DK', {month: 'short'})
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
    chartDataFromStatisticsOutput(result: StatisticsOutput, displayFn: (x: Date) => string): ChartData {
      const date = new Date(result.from);

      return {
        x: date,
        xDisplay: displayFn(date),
        y: result.numberOfEggs
      }
    },
    monthClicked(element: ActiveElement, chart: Chart<any>): void {
      const dataset = element.datasetIndex;
      const index = element.index;

      const dataPoint: ChartData = chart.data.datasets[dataset].data[index];
      this.selectedMonth = {
        from: addDays(startOfMonth(dataPoint.x), 1),
        to: addDays(endOfMonth(dataPoint.x), 1)
      };
      // this.getDaily(addDays(startOfMonth(dataPoint.x), 1), addDays(endOfMonth(dataPoint.x), 1));
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
  watch: {
    selectedMonth: {
      handler: function (val) {
        this.getDaily(val.from, val.to);
      },
      deep: true
    }
  },
  mounted() {
    this.getMonthly();
    this.getDaily(this.selectedMonth.from, this.selectedMonth.to);
  }
});
</script>

<style scoped lang="scss">
</style>
