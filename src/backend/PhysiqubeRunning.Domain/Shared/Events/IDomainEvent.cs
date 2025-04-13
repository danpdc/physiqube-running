using System;

namespace PhysiqubeRunning.Domain.Shared.Events;

/// <summary>
/// Interface for all domain events
/// </summary>
public interface IDomainEvent
{
    /// <summary>
    /// When the event occurred
    /// </summary>
    DateTime OccurredOn { get; }
}