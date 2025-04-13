namespace PhysiqubeRunning.Domain.UserProfile;

/// <summary>
/// Represents the self-assessed fitness level of a user
/// </summary>
public enum FitnessLevel
{
    /// <summary>
    /// Not specified
    /// </summary>
    NotSpecified = 0,
    
    /// <summary>
    /// Beginner level runner
    /// </summary>
    Beginner = 1,
    
    /// <summary>
    /// Intermediate level runner
    /// </summary>
    Intermediate = 2,
    
    /// <summary>
    /// Advanced level runner
    /// </summary>
    Advanced = 3
}