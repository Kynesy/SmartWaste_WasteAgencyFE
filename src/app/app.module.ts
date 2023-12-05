import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyAuthGuard } from './security/my-auth-guard.guard';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebars/sidebar/sidebar.component';

import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component'; // Instead of importing { clientId } from './path/to/module';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { LoadingComponent } from './components/loading/loading.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ToastComponent } from './components/toast/toast.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OperatorMenuComponent } from './components/sidebars/operator-menu/operator-menu.component';
import { MapComponent } from './components/map/map.component';
import { BinManagementComponent } from './components/bin-management/bin-management.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import TspNearestNeighbor from './utils/TspNearestNeighbor';
import { AuthComponent } from './components/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    ProfileComponent,
    NavbarComponent,
    LoadingComponent,
    ContactsComponent,
    ToastComponent,
    DashboardComponent,
    OperatorMenuComponent,
    MapComponent,
    BinManagementComponent,
    AlertsComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    LeafletModule,
    ScrollingModule
  ],
  providers: [
    MyAuthGuard,
    UserService,
    DatePipe,
    TspNearestNeighbor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
