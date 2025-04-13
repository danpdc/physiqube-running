using PhysiqubeRunning.Domain.UserProfile;

namespace PhysiqubeRunning.Application.Abstractions.Repositories;

/// <summary>
/// Repository interface for user physical profile data
/// </summary>
public interface IUserPhysicalProfileRepository
{
    /// <summary>
    /// Get a user's physical profile by user ID
    /// </summary>
    Task<UserPhysicalProfile?> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Add a new user physical profile
    /// </summary>
    Task<UserPhysicalProfile> AddAsync(UserPhysicalProfile profile, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Update an existing user physical profile
    /// </summary>
    Task<UserPhysicalProfile> UpdateAsync(UserPhysicalProfile profile, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Check if a user physical profile exists for the given user ID
    /// </summary>
    Task<bool> ExistsAsync(string userId, CancellationToken cancellationToken = default);
}