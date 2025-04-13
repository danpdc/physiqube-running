using System;
using System.Collections.Generic;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Represents a complete set of heart rate training zones for an athlete
/// </summary>
public class HeartRateZones
{
    // 1. Private fields
    private readonly List<HeartRateZone> _zones = new();
    
    // 2. Constants - none
    
    // 3. Public constructors
    /// <summary>
    /// Creates a new set of heart rate zones
    /// </summary>
    public HeartRateZones(int maxHeartRate, int? restingHeartRate = null)
    {
        MaxHeartRate = maxHeartRate;
        RestingHeartRate = restingHeartRate;
    }
    
    // 4. Private constructors
    // For EF Core
    private HeartRateZones() { }
    
    // 5. Properties
    /// <summary>
    /// Maximum heart rate used for calculations
    /// </summary>
    
    public int Id { get; set; }
    public int MaxHeartRate { get; private set; }
    
    /// <summary>
    /// Resting heart rate used for calculations (if applicable)
    /// </summary>
    public int? RestingHeartRate { get; private set; }
    
    /// <summary>
    /// Collection of heart rate zones
    /// </summary>
    public IReadOnlyList<HeartRateZone> Zones => _zones.AsReadOnly();
    
    // 6. Public methods
    /// <summary>
    /// Add a zone to the collection
    /// </summary>
    public void AddZone(HeartRateZone zone)
    {
        _zones.Add(zone);
    }
    
    /// <summary>
    /// Calculate heart rate zones based on maximum heart rate and optional resting heart rate
    /// </summary>
    public static HeartRateZones Calculate(int maxHeartRate, int? restingHeartRate = null)
    {
        if (maxHeartRate <= 0)
            throw new ArgumentException("Maximum heart rate must be positive", nameof(maxHeartRate));
            
        if (restingHeartRate.HasValue && restingHeartRate.Value <= 0)
            throw new ArgumentException("Resting heart rate must be positive", nameof(restingHeartRate));
            
        var zones = new HeartRateZones(maxHeartRate, restingHeartRate);
        
        // If using Karvonen formula (with resting heart rate)
        if (restingHeartRate.HasValue)
        {
            var hrr = maxHeartRate - restingHeartRate.Value; // Heart Rate Reserve
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone1Name,
                restingHeartRate.Value + (int)(hrr * 0.50),
                restingHeartRate.Value + (int)(hrr * 0.60),
                "Very light intensity, active recovery"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone2Name,
                restingHeartRate.Value + (int)(hrr * 0.60) + 1,
                restingHeartRate.Value + (int)(hrr * 0.70),
                "Light intensity, improves basic endurance"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone3Name,
                restingHeartRate.Value + (int)(hrr * 0.70) + 1,
                restingHeartRate.Value + (int)(hrr * 0.80),
                "Moderate intensity, improves aerobic capacity"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone4Name,
                restingHeartRate.Value + (int)(hrr * 0.80) + 1,
                restingHeartRate.Value + (int)(hrr * 0.90),
                "Hard intensity, improves anaerobic threshold"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone5Name,
                restingHeartRate.Value + (int)(hrr * 0.90) + 1,
                maxHeartRate,
                "Very hard intensity, improves maximum performance"
            ));
        }
        // Using simple percentage of max heart rate
        else
        {
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone1Name,
                (int)(maxHeartRate * 0.50),
                (int)(maxHeartRate * 0.60),
                "Very light intensity, active recovery"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone2Name,
                (int)(maxHeartRate * 0.60) + 1,
                (int)(maxHeartRate * 0.70),
                "Light intensity, improves basic endurance"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone3Name,
                (int)(maxHeartRate * 0.70) + 1,
                (int)(maxHeartRate * 0.80),
                "Moderate intensity, improves aerobic capacity"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone4Name,
                (int)(maxHeartRate * 0.80) + 1,
                (int)(maxHeartRate * 0.90),
                "Hard intensity, improves anaerobic threshold"
            ));
            
            zones.AddZone(new HeartRateZone(
                HeartRateZone.Zone5Name,
                (int)(maxHeartRate * 0.90) + 1,
                maxHeartRate,
                "Very hard intensity, improves maximum performance"
            ));
        }
        
        return zones;
    }
}