using System;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Represents a historical record of a user's heart rate zones
/// </summary>
public class HeartRateZonesTimeSeries : MetricTimeSeriesBase
{
    // 1. Private fields - none
    
    // 2. Constants - none
    
    // 3. Public constructors
    /// <summary>
    /// Creates a new heart rate zones time series entry
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="heartRateZones">The heart rate zones to record</param>
    public HeartRateZonesTimeSeries(string userId, HeartRateZones heartRateZones) : base(userId)
    {
        HeartRateZones = heartRateZones ?? throw new ArgumentNullException(nameof(heartRateZones));
    }
    
    // 4. Private constructors
    // For EF Core
    private HeartRateZonesTimeSeries() : base() { }
    
    // 5. Properties
    /// <summary>
    /// The heart rate zones at this point in time
    /// </summary>
    public HeartRateZones HeartRateZones { get; private set; }
    
    // 6. Public methods - none
    
    // 7. Private methods - none
}