export class ResponseWrapper {
  static success<T>(message: string, data?: T) {
    return this.buildResponse<T>(message, data);
  }

  static error<T>(message: string, errorDetails?: T) {
    return this.buildResponse<T>(message, undefined, errorDetails);
  }

  private static buildResponse<T>(message: string, data?: T, errorDetails?: T) {
    return {
      message,
      data,
      errorDetails,
    };
  }
}
