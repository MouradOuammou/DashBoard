import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from '../service/Authentification/auth.guard';
import { NoAuthGuard } from '../service/Authentification/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },

      // ==========================
      // Analytics Routes
      // ==========================
      {
        path: 'Analytics/Demographics_Insights',
        loadComponent: () => import('./views/Analytics/Demographics_Insights/demographics-insights.component').then(m => m.DemographicsInsightsComponent),
        data: {
          title: 'Demographics Insights'
        }
      },
      {
        path: 'Analytics/Inventory_Insights',
        loadComponent: () => import('./views/Analytics/Inventory_Insights/inventory-insights.component').then(m => m.InventoryInsightsComponent),
        data: {
          title: 'Inventory Insights'
        }
      },
      {
        path: 'Analytics/Traffic_Insights',
        loadComponent: () => import('./views/Analytics/Traffic_Insights/traffic-insights.component').then(m => m.TrafficInsightsComponent),
        data: {
          title: 'Traffic Insights'
        }
      },

      // ==========================
      // Predictions Routes
      // ==========================
      {
        path: 'Predictions/Shelf_Optimization',
        loadComponent: () => import('./views/Predictions/Shelf_Optimization/shelf-optimization.component').then(m => m.ShelfOptimizationComponent),
        data: {
          title: 'Shelf Optimization'
        }
      },
      {
        path: 'Predictions/Staff_Planning',
        loadComponent: () => import('./views/Predictions/Staff_Planning/staff-planning.component').then(m => m.StaffPlanningComponent),
        data: {
          title: 'Staff Planning'
        }
      },

      // ==========================
      // Store Routes
      // ==========================
      {
        path: 'Store',
        loadComponent: () => import('./views/Stores/store.component').then(m => m.StoreComponent),
        data: {
          title: 'Store Zones'
        }
      },



      // ==========================
      // Users Routes
      // ==========================
      {
        path: 'Users',
        loadComponent: () => import('./views/Users/users.component').then(m => m.UsersComponent),
        data: {
          title: 'Users'
        }
      },

      // ==========================
      // Settings Routes
      // ==========================
      {
        path: 'Settings',
        loadComponent: () => import('./views/Settings/system-configuration.component').then(m => m.SystemConfigurationComponent),
        data: {
          title: 'Settings'
        }
      }
    ]
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
