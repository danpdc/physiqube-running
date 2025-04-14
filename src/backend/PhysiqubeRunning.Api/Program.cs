using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PhysiqubeRunning.Api.Auth;
using PhysiqubeRunning.Application.Extensions;
using PhysiqubeRunning.Infrastructure.Data;
using PhysiqubeRunning.Infrastructure.Data.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.AddPersistence();
builder.Services.AddRepositories();
builder.Services.AddApplicationServices();

// Configure JWT authentication
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection("JwtSettings").Bind(jwtSettings);
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Use AddIdentityCore instead of AddIdentity to avoid conflicts
builder.Services.AddIdentityCore<IdentityUser>(options => 
{
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<PhysiqubeDbContext>()
.AddDefaultTokenProviders()
.AddSignInManager<SignInManager<IdentityUser>>();

// Configure JWT authentication
builder.Services.AddAuthentication(options => 
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience[0],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
        // Reduce clock skew to make token expiration more accurate
        ClockSkew = TimeSpan.Zero,
        // Add compatibility mode for .NET 6+
        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    };
    
    // Enable token source from query string for SignalR (if needed)
    options.BackchannelHttpHandler = new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    };
    
    // Save the token for later use if needed
    options.SaveToken = true;
    
    // Better error handling
    options.IncludeErrorDetails = true;
    
    // Ensure we don't require HTTPS in development
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    
    // Add events for token validation debugging
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Token validated successfully");
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError(context.Exception, "Authentication failed: {ErrorMessage}", context.Exception.Message);
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Auth message received: {Path}", context.HttpContext.Request.Path);
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogWarning("Challenge issued for: {Path}", context.HttpContext.Request.Path);
            return Task.CompletedTask;
        }
    };
});

// Add authorization services
builder.Services.AddAuthorization();

// Add CORS policy with explicit Authorization header
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("WWW-Authenticate")
              .WithHeaders("Content-Type", "Authorization", "Accept");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Use our diagnostic middleware to log authentication details
// Place BEFORE auth middleware to see incoming token attempts
app.UseAuthenticationDiagnostics();

// Use CORS before authentication
app.UseCors("AllowFrontend");

// Use authentication middleware before endpoints
app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
