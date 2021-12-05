import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatModule } from './mat/mat.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './core-services/auth.guard';
import { AppConfig } from './config/app.config';
import { JwtInterceptor } from './core-services/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BaseComponent } from './components/base/base.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { PostsComponent } from './components/home/posts/posts.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { FriendsComponent } from './components/friends/friends.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NetworkComponent } from './components/network/network.component';
import { UsersComponent } from './components/users/users.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BaseComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PostsComponent,
    ProfileComponent,
    FriendsComponent,
    SettingsComponent,
    NetworkComponent,
    UsersComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    AuthGuard,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
