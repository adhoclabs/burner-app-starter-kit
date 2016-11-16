/* eslint-disable import/prefer-default-export */

import SimpleOAuth2 from 'simple-oauth2';

const OAUTH_SCOPES = 'messages:connect burners:read burners:write contacts:write';

const OAUTH_CREDS = {
  client: {
    id: process.env.BURNER_APP_STARTER_KIT_OAUTH_CLIENT_ID,
    secret: process.env.BURNER_APP_STARTER_KIT_OAUTH_CLIENT_SECRET
  },
  auth: {
    authorizeHost: process.env.BURNER_APP_STARTER_KIT_OAUTH_AUTHORIZE_HOST,
    tokenHost: process.env.BURNER_APP_STARTER_KIT_OAUTH_TOKEN_HOST,
    tokenPath: process.env.BURNER_APP_STARTER_KIT_OAUTH_TOKEN_PATH,
  },
};

const oauth2 = SimpleOAuth2.create(OAUTH_CREDS);

export const OAUTH_URI = oauth2.authorizationCode.authorizeURL({
  redirect_uri: process.env.BURNER_APP_STARTER_KIT_OAUTH_CALLBACK_URL,
  scope: OAUTH_SCOPES,
  state: process.env.BURNER_APP_STARTER_KIT_OAUTH_STATE_SECRET,
});
