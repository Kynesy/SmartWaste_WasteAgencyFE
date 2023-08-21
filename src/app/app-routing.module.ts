import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';


import { AuthGuard } from '@auth0/auth0-angular';
import { MyAuthGuard } from './security/my-auth-guard.guard';
import { NotAuthorizedComponent } from './components/auth/not-authorized/not-authorized.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CallbackComponent } from './components/callback/callback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BinManagementComponent } from './components/bin-management/bin-management.component';
import { AlertsComponent } from './components/alerts/alerts.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'contacts', component: ContactsComponent},

  {path: 'operator/dashboard', component: DashboardComponent, canActivate: [MyAuthGuard], data: { requiredRole: 'OPERATOR' }},
  {path: 'operator/bins', component: BinManagementComponent, canActivate: [MyAuthGuard], data: { requiredRole: 'OPERATOR' }},
  {path: 'operator/alerts', component: AlertsComponent, canActivate: [MyAuthGuard], data: { requiredRole: 'OPERATOR' }},


  {path: 'unauthorized', component: NotAuthorizedComponent},
  {path: 'callback', component: CallbackComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
