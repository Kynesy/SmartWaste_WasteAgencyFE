import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
import { MyAuthGuard } from './security/my-auth-guard.guard';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebars/sidebar/sidebar.component';
import { LoginButtonComponent } from './components/auth/login-button/login-button.component';

import { LogoutButtonComponent } from './components/auth/logout-button/logout-button.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component'; // Instead of importing { clientId } from './path/to/module';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { NotAuthorizedComponent } from './components/auth/not-authorized/not-authorized.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ToastComponent } from './components/toast/toast.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OperatorMenuComponent } from './components/sidebars/operator-menu/operator-menu.component';
import { MapComponent } from './components/map/map.component';
import { BinManagementComponent } from './components/bin-management/bin-management.component';
import { AlertsComponent } from './components/alerts/alerts.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    ProfileComponent,
    NavbarComponent,
    NotAuthorizedComponent,
    LoadingComponent,
    ContactsComponent,
    CallbackComponent,
    ToastComponent,
    DashboardComponent,
    OperatorMenuComponent,
    MapComponent,
    BinManagementComponent,
    AlertsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    LeafletModule,
    AuthModule.forRoot({
      domain: "smart-city-waste-management.eu.auth0.com",
      clientId: "dRjomntHHflKM0fD2lw6QnBedSKOW6uC",
      authorizationParams: {
        redirect_uri: window.location.origin + '/callback'
      }
    }),
  ],
  providers: [
    MyAuthGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
