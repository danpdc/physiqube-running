using System;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Represents a historical record of a user's height measurement
/// </summary>
public class HeightTimeSeries : MetricTimeSeriesBase
{
    // 1. Private fields - none
    
    // 2. Constants - none
    
    // 3. Public constructors
    /// <summary>
    /// Creates a new height time series entry
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="heightInMillimeters">The height in millimeters</param>
    public HeightTimeSeries(string userId, int heightInMillimeters) : base(userId)
    {
        if (heightInMillimeters <= 0)
            throw new ArgumentException("Height must be greater than zero", nameof(heightInMillimeters));
            
        HeightInMillimeters = heightInMillimeters;
    }
    
    // 4. Private constructors
    // For EF Core
    private HeightTimeSeries() : base() { }
    
    // 5. Properties
    /// <summary>
    /// The height measurement in millimeters
    /// </summary>
    public int HeightInMillimeters { get; private set; }
    
    // Convenience properties for common unit conversions
    public decimal HeightInCentimeters => HeightInMillimeters / 10.0m;
    public decimal HeightInInches => HeightInMillimeters / 25.4m;
    
    // 6. Public methods - none
    
    // 7. Private methods - none
}