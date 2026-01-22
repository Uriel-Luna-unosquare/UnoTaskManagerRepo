The project uses the native OpenAPI support introduced in ASP.NET Core (.NET 9), avoiding third-party Swagger dependencies for better compatibility and future-proofing.

### Authentication
The API uses a simple JWT-based authentication mechanism.
A minimal login endpoint is provided for demonstration purposes.
Tokens are validated using standard ASP.NET Core authentication middleware.

JWT signing keys are configured with a minimum length of 256 bits to comply with HS256 security requirements.