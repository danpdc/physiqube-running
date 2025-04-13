namespace PhysiqubeRunning.Domain.Shared.ValueObjects;

/// <summary>
/// Base abstract class for all measurement value objects
/// </summary>
/// <typeparam name="T">The type of the measurement value</typeparam>
public abstract class Measurement<T> where T : struct
{
    /// <summary>
    /// The value of the measurement
    /// </summary>
    public T Value { get; protected set; }
    
    /// <summary>
    /// The measurement system this value is in
    /// </summary>
    public MeasurementSystem System { get; protected set; }

    protected Measurement(T value, MeasurementSystem system)
    {
        Value = value;
        System = system;
    }

    /// <summary>
    /// Convert the measurement to the specified system
    /// </summary>
    /// <param name="targetSystem">The target measurement system</param>
    /// <returns>Converted measurement value</returns>
    public abstract T ConvertTo(MeasurementSystem targetSystem);

    /// <summary>
    /// Format the measurement value with the appropriate unit based on the measurement system
    /// </summary>
    /// <returns>The formatted measurement string</returns>
    public abstract string ToString();
}