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
import {addDays, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, isAfter, isSameMonth} from "date-fns";
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
  Tooltip,
  PointElement,
  LineElement,
  type ChartOptions,
} from 'chart.js'
import type {StatisticsOutput} from '@/api/chicken-data';

type ChartData = {
  x: Date,
  xDisplay: string,
  y: number | string,
}

ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale)
const now = startOfDay(new Date());

const defaultChartOptions = {
  chartData: {
    datasets: [] as any[]
  },
  chartOptions: {
    datasets: {
      line: {
        pointRadius: 2,
        backgroundColor: '#dc3545',
        borderColor: 'rgba(19,121,91,0.1)'
      }
    },
    responsive: true,
    backgroundColor: '#13795b',
    parsing: {
      xAxisKey: 'xDisplay'
    },
    borderRadius: 2,
    plugins: {
      title: {
        display: true,
        text: ''
      },
      legend: {
        display: false
      },
    },
  } as ChartOptions<'bar'>
};

export default defineComponent({
  name: "GraphsView",
  components: {Bar},
  data() {
    return {
      monthly: this.monthlyOptions(),
      daily: this.dailyOptions(),
      selectedMonth: {
        from: addDays(startOfMonth(now), 1),
        to: addDays(endOfMonth(now), 1)
      },
    };
  },
  mounted() {
    this.getMonthly();
    this.getDaily(this.selectedMonth.from, this.selectedMonth.to);
  },
  methods: {
    monthlyOptions(): any {
      const options = structuredClone(defaultChartOptions);
      if (options.chartOptions?.plugins?.title?.text != null) {
        options.chartOptions.plugins.title.text = 'Æg per måned';
      }

      options.chartOptions.onClick = (event: ChartEvent, elements: ActiveElement[], chart: Chart<any, any[], any>) => {
        if (elements.length === 0) {
          return;
        }
        this.monthClicked(elements[0], chart);
      };

      return options;
    },
    dailyOptions(): any {
      const options = structuredClone(defaultChartOptions);
      if (options.chartOptions?.plugins?.title?.text != null) {
        options.chartOptions.plugins.title.text = 'Æg per dag';
      }

      return options;
    },
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
      const runningAverage = this.runningAverageChartData(data);

      this.monthly.chartData = {
        datasets: [
          {
            label: 'Gennemsnit',
            data: runningAverage,
            type: 'line',
          },
          {
            label: 'Antal æg',
            data
          },
        ]
      };
    },
    async getDaily(from: Date, to: Date): Promise<void> {
      const data = await StatisticsApi.getStats({from, to, unit: "DAY"})
          .then((result) =>
              result.map((result) =>
                  this.chartDataFromStatisticsOutput(
                      result,
                      (date) => date.toLocaleString('da-DK', {day: 'numeric'})
                  )));
      const runningAverage = this.runningAverageChartData(data);

      this.daily.chartData = {
        datasets: [
          {
            label: 'Gennemsnit',
            data: runningAverage,
            type: 'line'
          },
          {
            label: 'Antal æg',
            data
          },
        ]
      };
    },
    chartDataFromStatisticsOutput(result: StatisticsOutput, displayFn: (x: Date) => string): ChartData {
      const date = new Date(result.from);

      return {
        x: date,
        xDisplay: displayFn(date),
        y: result.numberOfEggs,
      }
    },
    runningAverageChartData(data: ChartData[]): ChartData[] {
      const result: ChartData[] = [];
      let previousAverage = 0;

      for (let i = 0; i < data.length; i++) {
        const dataPoint = data[i];
        const yAsNumber = (typeof dataPoint.y === "string") ? parseInt(dataPoint.y, 10) : dataPoint.y

        let currentAverage: number;
        if (yAsNumber === 0 && isAfter(dataPoint.x, addDays(now, 1))) {
          currentAverage = previousAverage;
        } else {
          currentAverage = ((previousAverage * i) + yAsNumber) / (i + 1);
        }
        result.push({
          x: dataPoint.x,
          xDisplay: dataPoint.xDisplay,
          y: currentAverage.toFixed(2)
        });
        previousAverage = currentAverage;
      }

      return result;
    },
    monthClicked(element: ActiveElement, chart: Chart<any>): void {
      const dataset = element.datasetIndex;
      const index = element.index;

      const dataPoint: ChartData = chart.data.datasets[dataset].data[index];
      this.selectedMonth = {
        from: addDays(startOfMonth(dataPoint.x), 1),
        to: addDays(endOfMonth(dataPoint.x), 1)
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
});
</script>

<style scoped lang="scss">
</style>
