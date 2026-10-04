import AppError from "./app-error";

class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export default NotFoundError;
