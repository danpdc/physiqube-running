using Microsoft.Extensions.DependencyInjection;
using PhysiqubeRunning.Application.Abstractions.Repositories;
using PhysiqubeRunning.Domain.Metrics;
using PhysiqubeRunning.Domain.UserProfile;
using PhysiqubeRunning.Infrastructure.Data.Repositories;

namespace PhysiqubeRunning.Infrastructure.Data.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<IUserPhysicalProfileRepository, UserPhysicalProfileRepository>();
        services.AddScoped<IMetricsTimeSeriesRepository, MetricsTimeSeriesRepository>();
        
        
        return services;
    }
}