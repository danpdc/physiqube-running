using System;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Represents a historical record of a user's weight measurement
/// </summary>
public class WeightTimeSeries : MetricTimeSeriesBase
{
    // 1. Private fields - none
    
    // 2. Constants - none
    
    // 3. Public constructors
    /// <summary>
    /// Creates a new weight time series entry
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="weightInGrams">The weight in grams</param>
    public WeightTimeSeries(string userId, int weightInGrams) : base(userId)
    {
        if (weightInGrams <= 0)
            throw new ArgumentException("Weight must be greater than zero", nameof(weightInGrams));
            
        WeightInGrams = weightInGrams;
    }
    
    // 4. Private constructors
    // For EF Core
    private WeightTimeSeries() : base() { }
    
    // 5. Properties
    /// <summary>
    /// The weight measurement in grams
    /// </summary>
    public int WeightInGrams { get; private set; }
    
    // Convenience properties for common unit conversions
    public decimal WeightInKilograms => WeightInGrams / 1000.0m;
    public decimal WeightInPounds => WeightInGrams / 453.59237m;
    
    // 6. Public methods - none
    
    // 7. Private methods - none
}