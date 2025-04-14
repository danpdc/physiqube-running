using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace PhysiqubeRunning.Api.Auth
{
    /// <summary>
    /// Middleware for diagnosing authentication issues
    /// </summary>
    public class AuthenticationDiagnosticsMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthenticationDiagnosticsMiddleware> _logger;
        private readonly JwtSettings _jwtSettings;

        public AuthenticationDiagnosticsMiddleware(
            RequestDelegate next, 
            ILogger<AuthenticationDiagnosticsMiddleware> logger,
            IOptions<JwtSettings> jwtOptions)
        {
            _next = next;
            _logger = logger;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            _logger.LogInformation("Authorization header: {AuthHeader}", authHeader ?? "null");

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                _logger.LogInformation("Token extracted: {TokenLength} characters", token.Length);

                try
                {
                    // Decode token without validation to inspect its contents
                    var handler = new JwtSecurityTokenHandler();
                    
                    // Simply read the token to see its structure
                    if (handler.CanReadToken(token))
                    {
                        var jwtToken = handler.ReadJwtToken(token);
                        _logger.LogInformation("JWT token header: {Header}", string.Join(", ", 
                            jwtToken.Header.Select(h => $"{h.Key}: {h.Value}")));
                        
                        // Log all claims to help debug
                        foreach (var claim in jwtToken.Claims)
                        {
                            _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);
                        }
                        
                        _logger.LogInformation("Token issuer: {Issuer}", jwtToken.Issuer);
                        _logger.LogInformation("Token audience: {Audience}", 
                            string.Join(", ", jwtToken.Audiences));
                        _logger.LogInformation("Token valid from: {NotBefore} to {Expires}", 
                            jwtToken.ValidFrom, jwtToken.ValidTo);
                    }
                    else
                    {
                        _logger.LogWarning("Token cannot be read as JWT");
                    }

                    // Don't try manual validation since it caused issues
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inspecting token: {Message}", ex.Message);
                }
            }
            else
            {
                _logger.LogWarning("No valid authorization header found");
            }

            // Check if user is authenticated after passing through authentication middleware
            if (context.User.Identity?.IsAuthenticated == true)
            {
                _logger.LogInformation("User is authenticated as {UserId}", 
                    context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    context.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? 
                    "unknown");
                
                _logger.LogInformation("User claims: {Claims}", string.Join(", ", 
                    context.User.Claims.Select(c => $"{c.Type}: {c.Value}")));
            }
            else
            {
                _logger.LogWarning("User is NOT authenticated");
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }
    }

    // Extension method to make it easier to add the middleware
    public static class AuthenticationDiagnosticsMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuthenticationDiagnostics(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthenticationDiagnosticsMiddleware>();
        }
    }
}