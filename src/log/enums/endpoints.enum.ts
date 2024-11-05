export enum Endpoints {
  // Auth routes
  SIGN_UP = '/api/auth/sign-up',
  SIGN_IN = '/api/auth/sign-in',
  REFRESH = '/api/auth/refresh',

  // User routes
  CREATE_USER = '/api/users/create',
  GET_ALL_USERS = '/api/users/get-all',
  GET_ONE_USER = '/api/users/get-one',
  UPDATE_USER = '/api/users/update',
  DELETE_USER = '/api/users/delete',

  // Log routes
  GET_LOGS = '/api/logs/get-all',
  GET_LOG_BY_ID = '/api/logs/get-one',
  GET_LOGS_BY_ENDPOINT = '/api/logs/endpoint',
} 