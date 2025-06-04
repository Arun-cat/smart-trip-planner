import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { Request } from './request/request';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'register', component: Register},
    {path: 'dashboard', component: Dashboard },
    {path: 'request', component: Request},
    { path: 'admin-dashboard', component: AdminDashboardComponent }
];
// , canActivate: [AuthGuard] 

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
//   })
// export class AppRoutingModule {}