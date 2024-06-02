// project import
import UserRoutes from './routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <UserRoutes />
    </ScrollTop>

  </ThemeCustomization>
);

export default App;
