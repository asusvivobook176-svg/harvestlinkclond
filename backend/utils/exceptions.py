class HarvestLinkError(Exception):
    """Base exception for HarvestLink"""
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class ValidationError(HarvestLinkError):
    def __init__(self, message):
        super().__init__(message, 400)

class AuthenticationError(HarvestLinkError):
    def __init__(self, message="Unauthorized"):
        super().__init__(message, 401)

class NotFoundError(HarvestLinkError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, 404)

class MLError(HarvestLinkError):
    def __init__(self, message="ML prediction failed"):
        super().__init__(message, 500)
