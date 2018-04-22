import { user, generateToken } from './data';

const APIs = {
  GET: {
    '/api/token': {
      headers: {
        Authorization: true
      },
      successStatus: 200,
      successData: { token: generateToken() },
      errorStatus: 400
    },
    '/api/users/me': {
      headers: {
        Authorization: true
      },
      errorHeaders: {
        headers: 'Authorization header missing'
      },
      successStatus: 200,
      successData: user,
      errorStatus: 400
    },
    '/error': {
      successStatus: 400
    }
  },
  POST: {
    '/api/login': {
      data: {
        username: 'TestUser',
        password: true
      },
      successData: { token: generateToken() },
      errorData: {
        data: 'Invalid username or password!'
      },
      successStatus: 200,
      errorStatus: 400
    },
    '/error': {
      successStatus: 400
    }
  },
  DELETE: {

  },
  PUT: {

  }
};

export class Fetch {

  callApi (method, headers, path, body = null) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        method = method.toUpperCase();
        const { status, response } = parseRequest(method, path, headers, body);
        console.log(status);
        const mockReturnObject = {
          status: status,
          text: () => {
            return Promise.resolve(response);
          },
          json: () => {
            return Promise.resolve(response);
          }
        };
        if (status === 600) reject(mockReturnObject);
        else resolve(mockReturnObject);
      }, 500);
    });
  }

}

function parseRequest(method, path, headers, body = {}) {
  let status, response;
  if (APIs[method]) {
    if (APIs[method][path]) {
      let passHeaders = true;
      if (APIs[method][path].headers) {
        const h = APIs[method][path].headers;
        const h2 = headers;
        for (let key in h) {
          if (h2[key]) {
            if (h[key] === true || h[key] === h2[key]) continue;
            passHeaders = false;
          } else passHeaders = false;
        }
      }
      let passData = true;
      if (APIs[method][path].data) {
        const d = APIs[method][path].data;
        const d2 = body;
        for (let key in d) {
          if (d2[key]) {
            if ((d[key] === true && d2[key]) || d[key] === d2[key]) continue;
            passData = false;
          } else passData = false;
        }
      }
      if (passHeaders && passData) {
        status = APIs[method][path].successStatus;
        response = APIs[method][path].successData;
      }
      if (!passHeaders) {
        status = APIs[method][path].errorStatus;
        response = APIs[method][path].errorHeaders;
      }
      if (!passData) {
        status = APIs[method][path].errorStatus;
        response = Object.assign({}, response, APIs[method][path].errorData);
      }
    }
  } else {
    status = 600;
  }

  if (!status) status = 404;
  if (!response) response = {};
  return {
    status,
    response
  };
}
