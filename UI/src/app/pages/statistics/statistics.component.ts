import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Member } from '@models/member';
import { MembersService } from '@services/members.service';
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

  barChart!: Chart;
  lineChart!: Chart;

  members: Member[] = [];

  constructor(private memberService: MembersService) {}
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
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
        this.initializeBarChart();
        this.initializeLineChart();
      },
    });
  }

  initializeBarChart() {
    const memberShortNames = this.members.map((member) =>
      member.shortName.toUpperCase()
    );
    const fullNames = this.members.map(
      (member) => member.firstName + ' ' + member.lastName
    );
    const dataValues = this.members.map(
      (member) => Math.floor(Math.random() * 100) + 1
    );

    if (this.barChartRef)
      this.barChart = new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: memberShortNames,
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
    const labels = this.members.map((member) => member.shortName.toUpperCase());
    const fullNames = this.members.map(
      (member) => member.firstName + ' ' + member.lastName
    );
    const dataValues = this.members.map(
      (member, index) => Math.floor(Math.random() * 100) + 1
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
