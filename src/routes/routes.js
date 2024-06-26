//Layouts
import { LoginLayout } from '~/layouts';
// Pages
import Home from '~/pages/Home/index';
import Profile from '~/pages/Profile';
import Login from '~/pages/Login';
import SignIn from '~/pages/SignIn';
import config from '~/config';
import OtpSignIn from '~/pages/OtpSignIn';
import ForgotPassword from '~/pages/ForgotPassword';
import OtpForgotPassword from '~/pages/OtpForgotPassword';
import ContactListFriend from '~/pages/ContactListFriend';
import ContactListGroup from '~/pages/ContactListGroup';
import ContactRequest from '~/pages/ContactRequest';
// Public routes
const publicRoutes = [
    { path: config.routes.login, component: Login, layout: LoginLayout },
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.signIn, component: SignIn, layout: LoginLayout },
    { path: config.routes.otpSignIn, component: OtpSignIn, layout: LoginLayout },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: LoginLayout },
    { path: config.routes.otpForgotPassword, component: OtpForgotPassword, layout: LoginLayout },
    { path: config.routes.contactListFriend, component: ContactListFriend },
    { path: config.routes.contactListGroup, component: ContactListGroup },
    { path: config.routes.contactRequest, component: ContactRequest },
];

const privateRoutes = [{ path: config.routes.login, component: Login, layout: LoginLayout }];

export { publicRoutes, privateRoutes };
