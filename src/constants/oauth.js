/* eslint-disable import/prefer-default-export */

import SimpleOAuth2 from 'simple-oauth2';

const OAUTH_SCOPES = 'messages:connect burners:read burners:write contacts:write';

const OAUTH_CREDS = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    authorizeHost: process.env.OAUTH_AUTHORIZE_HOST,
    tokenHost: process.env.BURNER_API_BASE_URL,
    tokenPath: 'oauth/access',
  },
};

export const oauth2 = SimpleOAuth2.create(OAUTH_CREDS);

export const OAUTH_URI = oauth2.authorizationCode.authorizeURL({
  redirect_uri: process.env.OAUTH_CALLBACK_URL,
  scope: OAUTH_SCOPES,
  state: process.env.OAUTH_STATE_SECRET,
});
