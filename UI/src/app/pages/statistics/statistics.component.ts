import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import Chart from 'chart.js/auto';

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

  barChart!: Chart;
  lineChart!: Chart;

  users: User[] = [];

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
    this.loadUsers();
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
    const userShortNames = this.users.map((user) =>
      user.shortName.toUpperCase()
    );
    const fullNames = this.users.map(
      (user) => user.firstName + ' ' + user.lastName
    );
    const dataValues = this.users.map(
      (user) => Math.floor(Math.random() * 100) + 1
    );

    if (this.barChartRef)
      this.barChart = new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: userShortNames,
          datasets: [
            {
              label: 'Some value',
              data: dataValues,
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
    const labels = this.users.map((user) => user.shortName.toUpperCase());
    const fullNames = this.users.map(
      (user) => user.firstName + ' ' + user.lastName
    );
    const dataValues = this.users.map(
      (user, index) => Math.floor(Math.random() * 100) + 1
    );

    if (this.lineChartRef)
      this.lineChart = new Chart(this.lineChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Some value',
              data: dataValues,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
}
