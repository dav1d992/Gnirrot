import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { NavComponent } from './components/nav/nav.component';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CarouselModule } from 'primeng/carousel';
import { AvatarModule } from 'primeng/avatar';
import { HomeComponent } from './pages/home/home.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EmployeesComponent } from '@pages/employees/employees.component';
import { EmployeeCardComponent } from '@components/employee-card/employee-card.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { EmployeeDetailsComponent } from '@pages/employee-details/employee-details.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { ProfileComponent } from '@pages/profile/profile.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProductDetailsComponent } from '@pages/product-details/product-details.component';
import { ProductsComponent } from '@pages/products/products.component';
import { ProductCardComponent } from '@components/product-card/product-card.component';
import { StatisticsComponent } from '@pages/statistics/statistics.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterUserComponent,
    EmployeesComponent,
    EmployeeCardComponent,
    EmployeeDetailsComponent,
    ProductDetailsComponent,
    ProductsComponent,
    ProfileComponent,
    ProductCardComponent,
    StatisticsComponent,
    TimeAgoPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    InputTextModule,
    DropdownModule,
    SplitButtonModule,
    CarouselModule,
    ToastModule,
    AvatarModule,
    DividerModule,
    TabViewModule,
    GalleriaModule,
    InputTextareaModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
