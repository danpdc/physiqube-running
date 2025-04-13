using System;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Base abstract class for all time series metrics that need historical tracking
/// </summary>
public abstract class MetricTimeSeriesBase
{
    // 1. Private fields - none
    
    // 2. Constants - none
    
    // 3. Public constructors
    /// <summary>
    /// Creates a new metric time series entry
    /// </summary>
    /// <param name="userId">The ID of the user this metric belongs to</param>
    protected MetricTimeSeriesBase(string userId)
    {
        UserId = userId ?? throw new ArgumentNullException(nameof(userId));
        RecordedAt = DateTime.UtcNow;
    }
    
    // 4. Private constructors
    // For EF Core
    protected MetricTimeSeriesBase() { }
    
    // 5. Properties
    /// <summary>
    /// Unique identifier for the metric record
    /// </summary>
    public Guid Id { get; protected set; }
    
    /// <summary>
    /// The user this metric belongs to
    /// </summary>
    public string UserId { get; protected set; }
    
    /// <summary>
    /// When this metric was recorded
    /// </summary>
    public DateTime RecordedAt { get; protected set; }
    
    // 6. Public methods - none
    
    // 7. Private methods - none
}