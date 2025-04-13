namespace PhysiqubeRunning.Domain.UserProfile;

/// <summary>
/// Represents the biological sex of a user, important for physiological calculations
/// </summary>
public enum BiologicalSex
{
    /// <summary>
    /// Not specified
    /// </summary>
    NotSpecified = 0,
    
    /// <summary>
    /// Male
    /// </summary>
    Male = 1,
    
    /// <summary>
    /// Female
    /// </summary>
    Female = 2,
    
    /// <summary>
    /// Other
    /// </summary>
    Other = 3
}