using Microsoft.Extensions.DependencyInjection;
using PhysiqubeRunning.Application.Services;

namespace PhysiqubeRunning.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<HeartRateZoneCalculationService>();
        return services;
    }
}