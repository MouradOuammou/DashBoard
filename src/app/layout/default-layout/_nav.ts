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
    iconComponent: { name: 'cil-chart-pie' },
    children: [
      {
        name: 'Traffic Insights',
        url: '/analytics/traffic-insights',
        iconComponent: { name: 'cil-people' }
      },
      {
        name: 'Demographics Insights',
        url: '/analytics/demographics-insights',
        iconComponent: { name: 'cil-user' }
      },
      {
        name: 'Inventory Insights',
        url: '/analytics/inventory-insights',
        iconComponent: { name: 'cil-layers' }
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
        iconComponent: { name: 'cil-user-follow' }
      },
      {
        name: 'Shelf Optimization',
        url: '/predictions/shelf-optimization',
        iconComponent: { name: 'cil-basket' }
      }
    ]
  },
  {
    name: 'Store',
    iconComponent: { name: 'cil-shop' },
    children: [
      {
        name: 'Zones',
        url: '/store/zones',
        iconComponent: { name: 'cil-location-pin' }
      },
      {
        name: 'Cameras',
        url: '/store/cameras',
        iconComponent: { name: 'cil-camera' }
      },
      {
        name: 'Shelves',
        url: '/store/shelves',
        iconComponent: { name: 'cil-bookmark' }
      },
      {
        name: 'Products',
        url: '/store/products',
        iconComponent: { name: 'cil-tags' }
      }
    ]
  },
  {
    name: 'Users',
    iconComponent: { name: 'cil-people' },
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
    iconComponent: { name: 'cil-star' },
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
        iconComponent: { name: 'cil-warning' }
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
    iconComponent: { name: 'cil-bell' },
  }
];
