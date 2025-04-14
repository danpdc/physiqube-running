namespace PhysiqubeRunning.Api.Auth;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string[] Audience { get; set; }
    public int ExpiryMinutes { get; set; }
}