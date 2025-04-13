namespace PhysiqubeRunning.Domain.Shared.ValueObjects;

/// <summary>
/// Represents a weight measurement with support for metric (kg) and imperial (lb) systems
/// </summary>
public class Weight : Measurement<decimal>
{
    private const decimal KgToLbsFactor = 2.20462m;
    
    private Weight(decimal value, MeasurementSystem system) : base(value, system)
    {
    }
    
    /// <summary>
    /// Create a new weight measurement in kilograms
    /// </summary>
    public static Weight FromKilograms(decimal kilograms)
    {
        return new Weight(kilograms, MeasurementSystem.Metric);
    }
    
    /// <summary>
    /// Create a new weight measurement in pounds
    /// </summary>
    public static Weight FromPounds(decimal pounds)
    {
        return new Weight(pounds, MeasurementSystem.Imperial);
    }
    
    /// <summary>
    /// Convert the weight to the target measurement system
    /// </summary>
    public override decimal ConvertTo(MeasurementSystem targetSystem)
    {
        if (System == targetSystem)
            return Value;
            
        return System == MeasurementSystem.Metric
            ? Value * KgToLbsFactor // kg to lbs
            : Value / KgToLbsFactor; // lbs to kg
    }
    
    /// <summary>
    /// Get the weight in kilograms regardless of the stored system
    /// </summary>
    public decimal Kilograms => System == MeasurementSystem.Metric 
        ? Value 
        : ConvertTo(MeasurementSystem.Metric);
        
    /// <summary>
    /// Get the weight in pounds regardless of the stored system
    /// </summary>
    public decimal Pounds => System == MeasurementSystem.Imperial 
        ? Value 
        : ConvertTo(MeasurementSystem.Imperial);
    
    /// <summary>
    /// Format the weight with the appropriate unit based on the measurement system
    /// </summary>
    public override string ToString()
    {
        return System == MeasurementSystem.Metric
            ? $"{Value:0.##} kg"
            : $"{Value:0.##} lbs";
    }
}