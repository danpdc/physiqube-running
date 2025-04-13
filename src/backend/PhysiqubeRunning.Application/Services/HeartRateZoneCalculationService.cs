using PhysiqubeRunning.Application.Abstractions.Repositories;
using PhysiqubeRunning.Domain.Metrics;

namespace PhysiqubeRunning.Application.Services;

/// <summary>
/// Service for calculating and managing heart rate zones
/// </summary>
public class HeartRateZoneCalculationService
{
    // 1. Private fields
    private readonly IMetricsTimeSeriesRepository _metricsRepository;
    
    // 2. Constants - none
    
    // 3. Public constructors
    public HeartRateZoneCalculationService(IMetricsTimeSeriesRepository metricsRepository)
    {
        _metricsRepository = metricsRepository ?? throw new ArgumentNullException(nameof(metricsRepository));
    }
    
    // 4. Private constructors - none
    
    // 5. Properties - none
    
    // 6. Public methods
    /// <summary>
    /// Calculate and store heart rate zones for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="maxHeartRate">Maximum heart rate</param>
    /// <param name="restingHeartRate">Optional resting heart rate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The calculated heart rate zones</returns>
    public async Task<HeartRateZones> CalculateAndStoreHeartRateZonesAsync(
        string userId, 
        int maxHeartRate, 
        int? restingHeartRate = null,
        CancellationToken cancellationToken = default)
    {
        // Calculate heart rate zones using the Karvonen formula
        var heartRateZones = HeartRateZones.Calculate(maxHeartRate, restingHeartRate);
        
        // Store the heart rate zones as a time series entry
        await _metricsRepository.AddHeartRateZonesAsync(userId, heartRateZones, cancellationToken);
        
        return heartRateZones;
    }
    
    /// <summary>
    /// Get the latest heart rate zones for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The latest heart rate zones or null if none exist</returns>
    public async Task<HeartRateZones?> GetLatestHeartRateZonesAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var latestZones = await _metricsRepository.GetLatestHeartRateZonesAsync(userId, cancellationToken);
        return latestZones?.HeartRateZones;
    }
    
    // 7. Private methods - none
}