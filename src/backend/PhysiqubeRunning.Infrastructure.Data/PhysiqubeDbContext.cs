using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PhysiqubeRunning.Domain.Metrics;
using PhysiqubeRunning.Domain.UserProfile;
using PhysiqubeRunning.Domain.Users;

namespace PhysiqubeRunning.Infrastructure.Data;

public class PhysiqubeDbContext : IdentityDbContext<ApplicationUser>
{
    public PhysiqubeDbContext(DbContextOptions<PhysiqubeDbContext> options)
        : base(options)
    {
    }

    // User Profile entities
    public DbSet<UserPhysicalProfile> UserPhysicalProfiles { get; set; } = null!;
    
    // Metrics for historical tracking
    public DbSet<HeartRateZonesTimeSeries> HeartRateZonesHistory { get; set; } = null!;
    public DbSet<WeightTimeSeries> WeightHistory { get; set; } = null!;
    public DbSet<HeightTimeSeries> HeightHistory { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply all configurations from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PhysiqubeDbContext).Assembly);
        
        base.OnModelCreating(modelBuilder);
    }
}