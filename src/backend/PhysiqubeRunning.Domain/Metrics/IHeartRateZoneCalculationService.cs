using System;
using System.Threading;
using System.Threading.Tasks;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Port for calculating and managing heart rate zones
/// </summary>
public interface IHeartRateZoneCalculationService
{
    /// <summary>
    /// Calculate and store heart rate zones for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="maxHeartRate">Maximum heart rate</param>
    /// <param name="restingHeartRate">Optional resting heart rate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The calculated heart rate zones</returns>
    Task<HeartRateZones> CalculateAndStoreHeartRateZonesAsync(
        string userId, 
        int maxHeartRate, 
        int? restingHeartRate = null,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get the latest heart rate zones for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The latest heart rate zones or null if none exist</returns>
    Task<HeartRateZones?> GetLatestHeartRateZonesAsync(
        string userId,
        CancellationToken cancellationToken = default);
}