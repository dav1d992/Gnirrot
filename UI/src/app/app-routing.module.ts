import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestErrorComponent } from './components/test-error/test-error.component';
import { MembersComponent } from '@pages/members/members.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberDetailsComponent } from '@pages/member-details/member-details.component';
import { ProfileComponent } from '@pages/profile/profile.component';

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
      { path: 'members', component: MembersComponent },
      { path: 'members/:username', component: MemberDetailsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages', component: MembersComponent },
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
