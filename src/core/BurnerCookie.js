import cookie from 'react-cookie';
import { COOKIE_SESSION_KEY } from '../constants';

export default class BurnerCookie {
  /**
   * Determine whether the current user is authenticated.
   *
   * @return {Boolean} true if authenticated, false otherwise
   */
  static isAuthenticated() {
    return (cookie.load(COOKIE_SESSION_KEY) ? true : false);
  }
}
