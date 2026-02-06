import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Profil from './components/BackOffice/Profil';
import BackApp from './components/App/BackOffice';
import Dashboard from './components/BackOffice/Dashboard/Dashboard';
import Edition from './components/BackOffice/Edition/Edition';
import Users from './components/BackOffice/Users/Users';
import FrontApp from './components/App/FrontOffice';
import NotFound from './components/Errors/NotFound';
import Home from './components/FrontOffice/Home/Home';
import InactivityDetector from './components/InactivityDetector/InactivityDetector';
import AccountRequest from './components/FrontOffice/Login/AccountRequest';
import ForgottenPassword from './components/FrontOffice/Login/ForgottenPassword';
import SignIn from './components/FrontOffice/Login/SignIn';
import NewUser from './components/FrontOffice/Login/NewUser';
import RecoverPassword from './components/FrontOffice/Login/RecoverPassword';
import MentionsLegales from './components/FrontOffice/StaticsPages/MentionsLegales/MentionsLegales';
import Organisme from './components/FrontOffice/Organisme/Organisme';
import Resultats from './components/FrontOffice/Resultats/Resultats';
import GuidesPapier from './components/FrontOffice/StaticsPages/GuidesPapier/GuidesPapier';
import RouteError from './components/Errors/RouteError';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<InactivityDetector />} errorElement={<RouteError />}>
      {/* Front-office */}
      <Route path="/" element={<FrontApp />}>
        <Route index element={<Home />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/guides-papier" element={<GuidesPapier />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/account-request" element={<AccountRequest />} />
        <Route path="/new-user" element={<NewUser />} />
      </Route>
      <Route path="/resultats" element={<Resultats />} />
      <Route path="/organisme/:slug" element={<Organisme />} />

      {/* Back-office */}
      <Route path="/admin" element={<BackApp />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/edition" element={<Edition />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/profil" element={<Profil />} />
      </Route>

      {/* Errors page */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
