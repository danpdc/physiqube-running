using System;
using PhysiqubeRunning.Domain.Shared.Events;

namespace PhysiqubeRunning.Domain.UserProfile.Events;

/// <summary>
/// Domain event fired when a user physical profile is created during onboarding
/// </summary>
public class UserPhysicalProfileCreatedEvent : IDomainEvent
{
    /// <summary>
    /// The ID of the user whose profile was created
    /// </summary>
    public Guid UserId { get; }
    
    /// <summary>
    /// The ID of the created physical profile
    /// </summary>
    public Guid ProfileId { get; }
    
    /// <summary>
    /// When the event occurred
    /// </summary>
    public DateTime OccurredOn { get; }
    
    /// <summary>
    /// Creates a new UserPhysicalProfileCreatedEvent
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="profileId">The profile ID</param>
    public UserPhysicalProfileCreatedEvent(Guid userId, Guid profileId)
    {
        UserId = userId;
        ProfileId = profileId;
        OccurredOn = DateTime.UtcNow;
    }
}