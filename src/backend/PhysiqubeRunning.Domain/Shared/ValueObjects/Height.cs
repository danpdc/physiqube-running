namespace PhysiqubeRunning.Domain.Shared.ValueObjects;

/// <summary>
/// Represents a height measurement with support for metric (cm) and imperial (in) systems
/// </summary>
public class Height : Measurement<decimal>
{
    private const decimal CmToInchesFactor = 0.393701m;
    
    private Height(decimal value, MeasurementSystem system) : base(value, system)
    {
    }
    
    /// <summary>
    /// Create a new height measurement in centimeters
    /// </summary>
    public static Height FromCentimeters(decimal centimeters)
    {
        return new Height(centimeters, MeasurementSystem.Metric);
    }
    
    /// <summary>
    /// Create a new height measurement in inches
    /// </summary>
    public static Height FromInches(decimal inches)
    {
        return new Height(inches, MeasurementSystem.Imperial);
    }
    
    /// <summary>
    /// Create a new height measurement in feet and inches
    /// </summary>
    public static Height FromFeetAndInches(int feet, decimal inches)
    {
        var totalInches = (feet * 12) + inches;
        return new Height(totalInches, MeasurementSystem.Imperial);
    }
    
    /// <summary>
    /// Convert the height to the target measurement system
    /// </summary>
    public override decimal ConvertTo(MeasurementSystem targetSystem)
    {
        if (System == targetSystem)
            return Value;
            
        return System == MeasurementSystem.Metric
            ? Value * CmToInchesFactor // cm to inches
            : Value / CmToInchesFactor; // inches to cm
    }
    
    /// <summary>
    /// Get the height in centimeters regardless of the stored system
    /// </summary>
    public decimal Centimeters => System == MeasurementSystem.Metric 
        ? Value 
        : ConvertTo(MeasurementSystem.Metric);
        
    /// <summary>
    /// Get the height in inches regardless of the stored system
    /// </summary>
    public decimal Inches => System == MeasurementSystem.Imperial 
        ? Value 
        : ConvertTo(MeasurementSystem.Imperial);
    
    /// <summary>
    /// Get the height as feet and inches (for imperial display)
    /// </summary>
    public (int Feet, decimal Inches) FeetAndInches
    {
        get
        {
            var totalInches = System == MeasurementSystem.Imperial 
                ? Value 
                : ConvertTo(MeasurementSystem.Imperial);
                
            var feet = (int)(totalInches / 12);
            var inches = totalInches % 12;
            
            return (feet, inches);
        }
    }
    
    /// <summary>
    /// Format the height with the appropriate unit based on the measurement system
    /// </summary>
    public override string ToString()
    {
        if (System == MeasurementSystem.Metric)
        {
            return $"{Value:0.#} cm";
        }
        else
        {
            var (feet, inches) = FeetAndInches;
            return $"{feet}' {inches:0.#}\"";
        }
    }
}