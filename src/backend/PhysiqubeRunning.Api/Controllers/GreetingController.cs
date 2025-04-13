using Microsoft.AspNetCore.Mvc;

namespace PhysiqubeRunning.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GreetingController : ControllerBase
{
    private readonly ILogger<GreetingController> _logger;

    public GreetingController(ILogger<GreetingController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<string> Get([FromQuery] string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            _logger.LogWarning("Greeting requested with empty name");
            return BadRequest("Name is required");
        }

        _logger.LogInformation("Greeting requested for {Name}", name);
        return $"Hello, {name}";
    }
}