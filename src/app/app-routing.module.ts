import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { FriendsComponent } from './components/friends/friends.component';
import { NetworkComponent } from './components/network/network.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UsersComponent } from './components/users/users.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'friends',
    component: FriendsComponent
  },
  {
    path: 'network',
    component: NetworkComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
