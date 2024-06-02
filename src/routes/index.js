import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import LandingPageRoutes from './LandingRoutes';


export default function ThemeRoutes() {
  return useRoutes([
    LandingPageRoutes,
    MainRoutes,
    LoginRoutes
  ]);
}
