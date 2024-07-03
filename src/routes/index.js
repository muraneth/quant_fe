import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import LandingPageRoutes from './LandingRoutes';
import UserRoutes from './User';
import StrategyPageRoutes from './StrategyRoutes';
import InvestRoutes from './InvestRoutes';
import MyquantDashBoardRoutes from './dashboard';

// import ProductRoutes from './Products';

export default function ThemeRoutes() {
  return useRoutes([
    LandingPageRoutes, 
    MyquantDashBoardRoutes,
    MainRoutes, 
    LoginRoutes, 
    UserRoutes, 
    StrategyPageRoutes, 
    InvestRoutes]);
}
