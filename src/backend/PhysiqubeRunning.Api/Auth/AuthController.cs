using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PhysiqubeRunning.Api.Auth.Contracts;

namespace PhysiqubeRunning.Api.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly JwtSettings _jwtSettings;
    private readonly SignInManager<IdentityUser> _signInManager;

    public AuthController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IOptions<JwtSettings> jwtSettings)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtSettings = jwtSettings.Value;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Create the user
        var user = new IdentityUser
        {
            UserName = request.Email,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        // Set user claims
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("FirstName", request.FirstName),
            new Claim("LastName", request.LastName)
        };

        await _userManager.AddClaimsAsync(user, claims);

        // Generate token
        var token = GenerateJwtToken(claims);

        // Return the response
        var response = new RegisterUserResponse
        {
            UserId = user.Id,
            Email = user.Email,
            Token = token
        };

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Find user by email
        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null)
        {
            return BadRequest(new { message = "Invalid email or password" });
        }

        // Check password
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Invalid email or password" });
        }

        // Get user claims
        var userClaims = await _userManager.GetClaimsAsync(user);
        
        // Create claims list for the token
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
        };
        
        // Add any existing claims
        claims.AddRange(userClaims);
        
        // Generate token
        var token = GenerateJwtToken(claims);

        // Return the response
        var response = new LoginUserResponse
        {
            UserId = user.Id,
            Email = user.Email,
            Token = token
        };

        return Ok(response);
    }

    private string GenerateJwtToken(List<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}