import { Fetch } from '../mock/fetch';
import { AsyncStorage } from 'react-native';
import {
  REQUEST_LOGIN_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  REQUEST_LOGOUT_SUCCESS
} from '../actions/types';

const fetch = new Fetch();

async function getHeaders(base) {
  let jwtHeader, token;

  try {
    token = await AsyncStorage.getItem('@MyStore:token');
  } catch(err) {
    token = null;
  }

  if (token) {
    jwtHeader = {
      'Authorization': `Bearer ${token}`
    };
  }

  return Object.assign({}, base, jwtHeader);
}

async function request(method, path, data) {
  let baseHeaders = {
    'Content-Type': 'application/json'
  };
  let headers = await getHeaders(baseHeaders);
  console.log(headers);
  return fetch.callApi(method, headers, path, data);
}

/**
 * Redux Middleware for handling asynchronous API call flow
 */
export default () => next => action => {
  if (!action.apiCall) {
    return next(action);
  }

  const {method, path, types, data} = action.apiCall;

  if (!method) {
    throw new Error('API request method should be defined.');
  }
  if (!path) {
    throw new Error('API request path should be defined.');
  }
  if (!types || types.length < 3) {
    throw new Error(`Define API request types as: [requestType, successType, errorType].`);
  }

  // Transform base apiCall action to normal action handled by reducers
  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction.apiCall;
    return finalAction;
  }

  // If response contains auth token, store it to localstorage and remove it
  // from forwarded action data
  async function filterToken(data) {
    const actionData = Object.assign({}, data);
    if (actionData.type === REQUEST_LOGIN_SUCCESS || actionData.type === REFRESH_TOKEN_SUCCESS) {
      try {
        await AsyncStorage.setItem('@MyStore:token', actionData.res.token);
        delete actionData.res.token;
      } catch(err) {
        console.error(err);
      }
    } else if (actionData.type === REQUEST_LOGOUT_SUCCESS) {
      try {
        await AsyncStorage.removeItem('@MyStore:token');
      } catch(err) {
        console.error(err);
      }
    }
    return actionData;
  }

  const [requestType, successType, errorType] = types;
  // Forwards requestType action down the middleware stack
  next(actionWith({type: requestType, data: data}));
  return request(method, path, data)
    .then(res => {
        let type;
        if (res.status >= 400) {
          type = errorType;
          return res.text().then(textData => {
            return filterToken({
              res: textData,
              type: type
            }).then(filteredData => {
              return next(actionWith(filteredData));
            });
          });
        } else {
          type = successType;
          return res.json().then(jsonData => {
            return filterToken({
              res: jsonData,
              type: type
            }).then(filteredData => {
              return next(actionWith(filteredData));
            });
          });
        }
      }).catch(err => {
        console.error(err);
        return filterToken({
          error: 'Not able to connect to the service.',
          type: errorType
        }).then(filteredData => {
          return next(actionWith(filteredData));
        });
      });
};
