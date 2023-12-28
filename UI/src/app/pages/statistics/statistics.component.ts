import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { Product } from '@models/product';
import { User } from '@models/user';
import { ProductService } from '@services/product.service';
import { UserService } from '@services/user.service';
import Chart from 'chart.js/auto';
import { productsToUserCount } from './helpers/productsToUserCount';
import { processProducts } from './helpers/processProducts';
import { getCssVariable } from 'src/app/helpers/get-css-variable.helper';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('barChart', { read: ElementRef, static: false })
  public barChartRef: ElementRef | null = null;
  @ViewChild('lineChart', { read: ElementRef, static: false })
  public lineChartRef: ElementRef | null = null;

  private readonly userService = inject(UserService);
  private readonly productService = inject(ProductService);

  barChart!: Chart;
  lineChart!: Chart;

  users: User[] = [];
  selectedDate: Date = new Date();
  allProducts: Product[] = [];

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

  ngAfterViewInit(): void {
    this.loadProducts();
    this.loadUsers();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
      },
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.initializeBarChart(
          this.selectedDate.getMonth() + 1, // Translates into luxon DateTime which goes from 1 to 12 instead of 0 to 11
          this.selectedDate.getFullYear()
        );
        this.initializeLineChart();
      },
    });
  }

  // Method to go to the next month
  goToNextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      1
    );
    this.initializeBarChart(
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getFullYear()
    );
  }

  // Method to go to the previous month
  goToPreviousMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      1
    );
    this.initializeBarChart(
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getFullYear()
    );
  }

  filterProductsByMonth(
    products: Product[],
    month: number,
    year: number
  ): Product[] {
    return products.filter((product) => {
      return product.created.month === month && product.created.year === year;
    });
  }

  initializeBarChart(month: number, year: number) {
    console.log('🚀 ~ month-year:', month, year);
    if (this.barChart) {
      this.barChart.destroy(); // Necessary for redrawing
    }
    const fullNames = this.users.map(
      (user) => user.firstName + ' ' + user.lastName
    );
    const filteredProducts = this.filterProductsByMonth(
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
