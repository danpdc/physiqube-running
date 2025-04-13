using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhysiqubeRunning.Domain.Shared.Events;

/// <summary>
/// Static helper class for raising domain events
/// </summary>
public static class DomainEvents
{
    private static List<Delegate> _handlers = new List<Delegate>();
    
    /// <summary>
    /// Register a handler for a specific domain event type
    /// </summary>
    /// <typeparam name="T">Type of domain event</typeparam>
    /// <param name="eventHandler">Event handler function</param>
    public static void Register<T>(Action<T> eventHandler) where T : IDomainEvent
    {
        _handlers.Add(eventHandler);
    }
    
    /// <summary>
    /// Register an async handler for a specific domain event type
    /// </summary>
    /// <typeparam name="T">Type of domain event</typeparam>
    /// <param name="eventHandler">Async event handler function</param>
    public static void Register<T>(Func<T, Task> eventHandler) where T : IDomainEvent
    {
        _handlers.Add(eventHandler);
    }
    
    /// <summary>
    /// Clear all registered event handlers
    /// </summary>
    public static void ClearHandlers()
    {
        _handlers.Clear();
    }
    
    /// <summary>
    /// Raise a domain event to all registered handlers
    /// </summary>
    /// <typeparam name="T">Type of domain event</typeparam>
    /// <param name="domainEvent">The domain event to raise</param>
    public static void Raise<T>(T domainEvent) where T : IDomainEvent
    {
        foreach (var handler in _handlers)
        {
            if (handler is Action<T> action)
            {
                action(domainEvent);
            }
            else if (handler is Func<T, Task> asyncAction)
            {
                // Fire and forget for simplicity
                // In a real implementation, you might want to use a queue
                asyncAction(domainEvent).ConfigureAwait(false);
            }
        }
    }
}