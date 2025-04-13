using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PhysiqubeRunning.Infrastructure.Data;

public class PhysiqubeDbContext : IdentityDbContext
{
    public PhysiqubeDbContext(DbContextOptions<PhysiqubeDbContext> options)
        : base(options)
    {
    }
    
    // ReSharper disable once RedundantOverriddenMember
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }
}