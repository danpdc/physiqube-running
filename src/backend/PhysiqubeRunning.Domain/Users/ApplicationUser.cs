using Microsoft.AspNetCore.Identity;

namespace PhysiqubeRunning.Domain.Users;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}