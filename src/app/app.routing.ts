import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/security/auth.guard';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { PartnersComponent } from './dashboard/partners/partners.component';
import { PoolComponent } from './dashboard/pool/pool.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { EmployeesComponent } from './dashboard/employees/employees.component';

const appRoutes : Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'comunicados', component: NotificationsComponent },
            { path: 'socios', component: PartnersComponent },
            { path: 'empleados', component: EmployeesComponent },
            { path: 'alberca', component: PoolComponent },
            { path: '**', component: HomeComponent }
        ],
        canActivate: [ AuthGuard ]
    },
    { path: '**', component: DashboardComponent }
];

export const appRoutingProviders: Array<any> = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
