import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestErrorComponent } from './components/test-error/test-error.component';
import { EmployeesComponent } from '@pages/employees/employees.component';
import { AuthGuard } from './guards/auth.guard';
import { EmployeeDetailsComponent } from '@pages/employee-details/employee-details.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { ProductDetailsComponent } from '@pages/product-details/product-details.component';
import { ProductsComponent } from '@pages/products/products.component';
import { StatisticsComponent } from '@pages/statistics/statistics.component';
import { MaterialsComponent } from '@pages/materials/materials.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'employees', component: EmployeesComponent },
      { path: 'employees/:username', component: EmployeeDetailsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages', component: EmployeesComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'materials', component: MaterialsComponent },
    ],
  },
  {
    path: 'errors',
    component: TestErrorComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
