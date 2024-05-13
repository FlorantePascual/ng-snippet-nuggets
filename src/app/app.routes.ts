import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'crypto',
        loadChildren: () => import('./crypto/crypto.routes')
    },
    {
        path: 'documentation',
        loadChildren: () => import('./pages/documentation/documentation.routes')
    },
    {
        path: 'features',
        loadChildren: () => import('./pages/features/features.routes')
    }
];
