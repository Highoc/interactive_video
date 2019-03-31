const MODES = {
  DEBUG_ALL_LOGS: 'DEBUG_ALL_LOGS',
  DEBUG_ONLY_ERRORS: 'DEBUG_ONLY_ERRORS',
  PRODUCTION: 'PRODUCTION',
};

export default class SmartPrint {
  static print(name, message) {
    if (SmartPrint.MODE === MODES.DEBUG_ALL_LOGS) {
      console.log('%s, message: %O', name, message);
    }
  }

  static error(name, error) {
    if (SmartPrint.MODE === MODES.DEBUG_ONLY_ERRORS || SmartPrint.MODE === MODES.DEBUG_ALL_LOGS) {
      if (error.response.status === 400) {
        console.error('%s, error: %s, details: %s', name, error.message, error.request.response);
      } else {
        console.error('%s, error: %s, details: %O', name, error.message, error.response);
      }
    }
  }
}

SmartPrint.MODE = MODES.DEBUG_ALL_LOGS;
