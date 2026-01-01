import { CustomError } from "./custom-error";

export class DataBaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = 500;
  constructor() {
    super("Somethign went worng");
    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
