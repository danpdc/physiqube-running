using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhysiqubeRunning.Api.Onboarding.Contracts;
using PhysiqubeRunning.Application.Onboarding;

namespace PhysiqubeRunning.Api.Onboarding;

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    private readonly ILogger<OnboardingController> _logger;
    private readonly OnboardingService _onboardingService;

    public OnboardingController(ILogger<OnboardingController> logger, OnboardingService onboardingService)
    {
        _logger = logger;
        _onboardingService = onboardingService;
    }

    [HttpPost]
    [Route("userInfo")]
    [Authorize]
    public async Task<IActionResult> SaveUserInfo([FromBody] SaveUserInfoRequest request)
    {
        // Check if model is valid (this uses the validation attributes in the request class)
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid user info request: {Errors}", 
                string.Join(", ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)));
            
            return BadRequest(ModelState);
        }

        // Get current user ID from claims if authenticated
        // For now, we'll use a placeholder value as instructed
        string userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "sample-user-id";
        var operationRequest = request.ToOnBoardingSetUserInfo(userId);
        var operationResult = await _onboardingService.OnboardUserAsync(operationRequest);
        var response = SaveUserInfoResponse.FromServiceResult(operationResult);

            return Ok(response);
    }
}