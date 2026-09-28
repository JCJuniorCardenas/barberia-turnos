import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message = typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
      ? exceptionResponse.message
      : isHttpException && typeof exceptionResponse === 'string'
        ? exceptionResponse
        : 'Ocurrió un error inesperado.';

    if (!isHttpException || status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(`Excepción no controlada: ${stack}`);
    }

    response.status(status).json({ statusCode: status, message });
  }
}