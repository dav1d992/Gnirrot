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
import { MembersComponent } from '@pages/members/members.component';
import { MemberCardComponent } from '@components/member-card/member-card.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { MemberDetailsComponent } from '@pages/member-details/member-details.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { ProfileComponent } from '@pages/profile/profile.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterUserComponent,
    MembersComponent,
    MemberCardComponent,
    MemberDetailsComponent,
    ProfileComponent,
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
