// assets
import { DashboardOutlined, LineChartOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  LineChartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/user/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'strategies',
      title: 'Strategies',
      type: 'item',
      url: '/user/strategies',
      icon: icons.LineChartOutlined
    }
  ]
};

export default dashboard;
