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
        url: '/Analytics/Traffic_Insights',
        iconComponent: { name: 'cil-walk' }
      },
      {
        name: 'Demographics Insights',
        url: '/Analytics/Demographics_Insights',
        iconComponent: { name: 'cil-people' }
      },
      {
        name: 'Inventory Insights',
        url: '/Analytics/Inventory_Insights',
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
        url: '/Predictions/Staff_Planning',
        iconComponent: { name: 'cil-calendar' }
      },
      {
        name: 'Shelf Optimization',
        url: '/Predictions/Shelf_Optimization',
        iconComponent: { name: 'cil-sort-ascending' }
      }
    ]
  },
  {
    name: 'Stores',
    iconComponent: { name: 'cil-building' },
        url: '/Store',

  },
  {
    name: 'Users',
    iconComponent: { name: 'cil-user' },
    url: '/Users',
  },
  {
    name: 'Settings',
    iconComponent: { name: 'cil-settings' },
    url: '/Settings'
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
];
