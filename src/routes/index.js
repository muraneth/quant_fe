import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import LandingPageRoutes from './LandingRoutes';
import UserRoutes from './User';
import StrategyPageRoutes from './StrategyRoutes';
import InvestRoutes from './InvestRoutes';
import AdminRoutes from './AdminRoutes';
import DataPageRoutes from './TokenChart';
import CompareRoutes from './CompareToken';

export default function ThemeRoutes() {
  return useRoutes([
    AdminRoutes,
    LandingPageRoutes,
    MainRoutes,
    LoginRoutes,
    UserRoutes,
    StrategyPageRoutes,
    InvestRoutes,
    DataPageRoutes,
    CompareRoutes
  ]);
}
