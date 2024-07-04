import time
import json
import logging

request_logger = logging.getLogger(__name__)


class RequestLogMiddleware:
    """Request Logging Middleware."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Start timing the request
        start_time = time.monotonic()

        # Continue the request
        response = self.get_response(request)

        # Calculate request duration
        duration = time.monotonic() - start_time

        # Simplify logging to focus on request path and status
        if "/api/" in request.get_full_path():
            log_data = {
                "method": request.method,
                "path": request.get_full_path(),
                "status_code": response.status_code,
                "duration": f"{duration:.2f}s",
            }
            request_logger.info(json.dumps(log_data))

        return response

    def process_exception(self, request, exception):
        request_logger.exception(f"Unhandled Exception: {str(exception)}")
