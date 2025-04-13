using System;

namespace PhysiqubeRunning.Domain.Metrics;

/// <summary>
/// Domain service for calculating heart rate zones
/// </summary>
public class HeartRateZoneCalculator
{
    /// <summary>
    /// Calculate heart rate zones based on maximum heart rate and optional resting heart rate
    /// </summary>
    /// <param name="maxHeartRate">Maximum heart rate in BPM</param>
    /// <param name="restingHeartRate">Optional resting heart rate in BPM</param>
    /// <returns>Heart rate zones</returns>
    public HeartRateZones Calculate(int maxHeartRate, int? restingHeartRate = null)
    {
        if (maxHeartRate <= 0)
            throw new ArgumentException("Max heart rate must be positive", nameof(maxHeartRate));
            
        if (restingHeartRate.HasValue && restingHeartRate.Value <= 0)
            throw new ArgumentException("Resting heart rate must be positive", nameof(restingHeartRate));
            
        return HeartRateZones.Calculate(maxHeartRate, restingHeartRate);
    }
    
    /// <summary>
    /// Estimate maximum heart rate based on age using the common formula: 220 - age
    /// </summary>
    /// <param name="age">User's age in years</param>
    /// <returns>Estimated maximum heart rate</returns>
    public int EstimateMaxHeartRate(int age)
    {
        if (age < 10 || age > 120)
            throw new ArgumentOutOfRangeException(nameof(age), "Age must be between 10 and 120");
            
        return 220 - age;
    }
}