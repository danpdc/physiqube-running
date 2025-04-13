using System;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Represents a heart rate training zone with lower and upper bounds
/// </summary>
public class HeartRateZone
{
    // 1. Constants
    public const string Zone1Name = "Zone 1 - Recovery";
    public const string Zone2Name = "Zone 2 - Aerobic";
    public const string Zone3Name = "Zone 3 - Tempo";
    public const string Zone4Name = "Zone 4 - Threshold";
    public const string Zone5Name = "Zone 5 - VO2Max";
    
    // 2. Public constructors
    /// <summary>
    /// Creates a new heart rate zone
    /// </summary>
    public HeartRateZone(string name, int lowerBound, int upperBound, string description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Zone name cannot be empty", nameof(name));
            
        if (lowerBound < 0)
            throw new ArgumentException("Lower bound must be greater than or equal to 0", nameof(lowerBound));
            
        if (upperBound <= lowerBound)
            throw new ArgumentException("Upper bound must be greater than lower bound", nameof(upperBound));
            
        Name = name;
        LowerBound = lowerBound;
        UpperBound = upperBound;
        Description = description;
    }
    
    // 3. Private constructors
    // For EF Core and deserialization
    private HeartRateZone() { }
    
    public int Id { get; set; }
    
    // 4. Properties
    /// <summary>
    /// Name of the heart rate zone
    /// </summary>
    public string Name { get; private set; }
    
    /// <summary>
    /// Lower heart rate bound for the zone (bpm)
    /// </summary>
    public int LowerBound { get; private set; }
    
    /// <summary>
    /// Upper heart rate bound for the zone (bpm)
    /// </summary>
    public int UpperBound { get; private set; }
    
    /// <summary>
    /// Optional description of the heart rate zone
    /// </summary>
    public string Description { get; private set; }
    
    // 5. Public methods
    /// <summary>
    /// Determines if a heart rate value is within this zone
    /// </summary>
    public bool Contains(int heartRate)
    {
        return heartRate >= LowerBound && heartRate <= UpperBound;
    }
}