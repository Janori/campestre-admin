import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from './shared/security/auth.guard';

// import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { PartnersComponent } from './dashboard/partners/partners.component';

import { PoolComponent } from './dashboard/pool/pool.component';

const appRoutes : Routes = [
    // { path: 'login', component: LoginComponent },
    // { path: 'lockscreen', component: LockscreenComponent},
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'socios', component: PartnersComponent },
            { path: 'alberca', component: PoolComponent },
            { path: '**', component: HomeComponent }
        ]
    },
    { path: '**', component: DashboardComponent }
];

export const appRoutingProviders: Array<any> = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
