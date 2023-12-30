import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Product } from '@models/product';
import { User } from '@models/user';
import Chart from 'chart.js/auto';
import { productsToUserCount } from './helpers/productsToUserCount';
import { processProducts } from './helpers/processProducts';
import { getCssVariable } from 'src/app/helpers/get-css-variable.helper';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '@store/user/user.selectors';
import { selectAllProducts } from '@store/product/product.selectors';
import { filterProductsByMonth } from './helpers/filterProductsByMonth';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnDestroy {
  @ViewChild('barChart', { read: ElementRef, static: false })
  public barChartRef: ElementRef | null = null;
  @ViewChild('lineChart', { read: ElementRef, static: false })
  public lineChartRef: ElementRef | null = null;

  private readonly store = inject(Store);

  public barChart!: Chart;
  public lineChart!: Chart;

  public users: User[] = [];
  public selectedDateSignal: WritableSignal<Date> = signal(new Date());
  public allProducts: Product[] = [];
  private storeUsers = this.store.selectSignal(selectAllUsers);
  private storeProducts = this.store.selectSignal(selectAllProducts);
  public selectedDate: Date = new Date();

  constructor() {
    effect(
      () => {
        this.users = this.storeUsers();
        this.allProducts = this.storeProducts();
        this.selectedDate = this.selectedDateSignal();

        this.initializeBarChart(
          this.selectedDate.getMonth(),
          this.selectedDate.getFullYear()
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        this.allProducts = this.storeProducts();
        this.initializeLineChart();
      },
      { allowSignalWrites: true }
    );
  }

  ngOnDestroy(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    this.barChartRef = null;
    this.lineChartRef = null;
  }

  goToNextMonth() {
    const date = this.selectedDateSignal();
    this.selectedDateSignal.set(
      new Date(date.getFullYear(), date.getMonth() + 1, 1)
    );
    this.initializeBarChart(date.getMonth(), date.getFullYear());
  }

  goToPreviousMonth() {
    const date = this.selectedDateSignal();
    this.selectedDateSignal.set(
      new Date(date.getFullYear(), date.getMonth() - 1, 1)
    );
    this.initializeBarChart(date.getMonth(), date.getFullYear());
  }

  initializeBarChart(month: number, year: number) {
    if (this.barChart) {
      this.barChart.destroy(); // Necessary for redrawing
    }
    const fullNames = this.users.map(
      (user) => user.firstName + ' ' + user.lastName
    );
    const filteredProducts = filterProductsByMonth(
      this.allProducts,
      month,
      year
    );

    const result = productsToUserCount(filteredProducts, this.users);

    if (this.barChartRef)
      this.barChart = new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: result.map((name) => name.userShortName.toLocaleUpperCase()),
          datasets: [
            {
              label: 'Product orders done',
              data: result.map((name) => name.noOfProducts),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  return fullNames[tooltipItems[0].dataIndex];
                },
              },
            },
          },
        },
      });
  }

  initializeLineChart() {
    if (this.lineChart) {
      this.lineChart.destroy(); // Necessary for redrawing
    }
    const result = processProducts(this.allProducts);

    if (this.lineChartRef)
      this.lineChart = new Chart(this.lineChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: result.map((x) => x.monthCreated),
          datasets: [
            {
              label: 'Created',
              data: result.map((x) => x.amountCreated),
              backgroundColor: getCssVariable('--red'),
            },
            {
              label: 'Started',
              data: result.map((x) => x.amountStarted),
              backgroundColor: getCssVariable('--yellow'),
            },
            {
              label: 'Ended',
              data: result.map((x) => x.amountEnded),
              backgroundColor: getCssVariable('--green'),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
  }
}
