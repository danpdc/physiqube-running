using System;
using PhysiqubeRunning.Domain.Shared.Events;

namespace PhysiqubeRunning.Domain.Metrics.Events;

/// <summary>
/// Domain event fired when heart rate zones are calculated for a user
/// </summary>
public class HeartRateZonesCalculatedEvent : IDomainEvent
{
    /// <summary>
    /// The ID of the user whose heart rate zones were calculated
    /// </summary>
    public Guid UserId { get; }
    
    /// <summary>
    /// The ID of the heart rate zones time series record
    /// </summary>
    public Guid HeartRateZonesTimeSeriesId { get; }
    
    /// <summary>
    /// Maximum heart rate used for the calculation
    /// </summary>
    public int MaxHeartRate { get; }
    
    /// <summary>
    /// Resting heart rate used for the calculation (if provided)
    /// </summary>
    public int? RestingHeartRate { get; }
    
    /// <summary>
    /// When the event occurred
    /// </summary>
    public DateTime OccurredOn { get; }
    
    /// <summary>
    /// Creates a new HeartRateZonesCalculatedEvent
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="heartRateZonesTimeSeriesId">The heart rate zones time series record ID</param>
    /// <param name="maxHeartRate">Maximum heart rate used</param>
    /// <param name="restingHeartRate">Resting heart rate used (if provided)</param>
    public HeartRateZonesCalculatedEvent(
        Guid userId, 
        Guid heartRateZonesTimeSeriesId, 
        int maxHeartRate, 
        int? restingHeartRate = null)
    {
        UserId = userId;
        HeartRateZonesTimeSeriesId = heartRateZonesTimeSeriesId;
        MaxHeartRate = maxHeartRate;
        RestingHeartRate = restingHeartRate;
        OccurredOn = DateTime.UtcNow;
    }
}