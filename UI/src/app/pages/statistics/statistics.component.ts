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
        this.initializeBarChart();
        this.initializeLineChart();
      },
    });
  }

  initializeBarChart() {
    const fullNames = this.users.map(
      (user) => user.firstName + ' ' + user.lastName
    );

    const result = productsToUserCount(this.allProducts, this.users);

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
