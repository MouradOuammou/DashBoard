import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Analytics',
    iconComponent: { name: 'cil-graph' },
    children: [
      {
        name: 'Traffic Insights',
        url: '/analytics/traffic-insights',
        iconComponent: { name: 'cil-walk' }
      },
      {
        name: 'Demographics Insights',
        url: '/analytics/demographics-insights',
        iconComponent: { name: 'cil-people' }
      },
      {
        name: 'Inventory Insights',
        url: '/analytics/inventory-insights',
        iconComponent: { name: 'cil-storage' }
      }
    ]
  },
  {
    name: 'Predictions',
    iconComponent: { name: 'cil-chart-line' },
    children: [
      {
        name: 'Staff Planning',
        url: '/predictions/staff-planning',
        iconComponent: { name: 'cil-calendar' }
      },
      {
        name: 'Shelf Optimization',
        url: '/predictions/shelf-optimization',
        iconComponent: { name: 'cil-sort-ascending' }
      }
    ]
  },
  {
    name: 'Store',
    iconComponent: { name: 'cil-building' },
    children: [
      {
        name: 'Zones',
        url: '/store/zones',
        iconComponent: { name: 'cil-map' }
      },
      {
        name: 'Cameras',
        url: '/store/cameras',
        iconComponent: { name: 'cil-video ' }
      },
      {
        name: 'Shelves',
        url: '/store/shelves',
        iconComponent: { name: 'cil-library' }
      },
      {
        name: 'Products',
        url: '/store/products',
        iconComponent: { name: 'cil-inbox' }
      }
    ]
  },
  {
    name: 'Users',
    iconComponent: { name: 'cil-user' },
    url: '/users',
  },
  {
    name: 'Settings',
    iconComponent: { name: 'cil-settings' },
    url: '/settings'
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Login',
        url: '/login',
        iconComponent: { name: 'cil-account-logout' }
      },
      {
        name: 'Register',
        url: '/register',
        iconComponent: { name: 'cil-user-plus' }
      },
      {
        name: 'Error 404',
        url: '/404',
        iconComponent: { name: 'cil-x-circle' }
      },
      {
        name: 'Error 500',
        url: '/500',
        iconComponent: { name: 'cil-bug' }
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    iconComponent: { name: 'cil-bell-exclamation' },
  }
];
