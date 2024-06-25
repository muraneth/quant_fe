// project import
import Routes from './routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { GoogleOAuthProvider } from '@react-oauth/google';


// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const CLIENT_ID = '586510859498-n781b8iru79em2he06oevvo65alr719r.apps.googleusercontent.com';
const App = () => (
  <GoogleOAuthProvider clientId={CLIENT_ID}>
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
  </GoogleOAuthProvider>
);

export default App;
