using PhysiqubeRunning.Domain.Metrics;

namespace PhysiqubeRunning.Application.Abstractions.Repositories;

/// <summary>
/// Repository interface for metrics time series data
/// </summary>
public interface IMetricsTimeSeriesRepository
{
    /// <summary>
    /// Add a new heart rate zones time series entry
    /// </summary>
    Task<HeartRateZonesTimeSeries> AddHeartRateZonesAsync(string userId, HeartRateZones zones, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Add a new weight time series entry
    /// </summary>
    Task<WeightTimeSeries> AddWeightAsync(string userId, int weightInGrams, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Add a new height time series entry
    /// </summary>
    Task<HeightTimeSeries> AddHeightAsync(string userId, int heightInMillimeters, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get the latest heart rate zones for a user
    /// </summary>
    Task<HeartRateZonesTimeSeries?> GetLatestHeartRateZonesAsync(string userId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get the latest weight for a user
    /// </summary>
    Task<WeightTimeSeries?> GetLatestWeightAsync(string userId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get the latest height for a user
    /// </summary>
    Task<HeightTimeSeries?> GetLatestHeightAsync(string userId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get heart rate zones history for a user within a date range
    /// </summary>
    Task<IEnumerable<HeartRateZonesTimeSeries>> GetHeartRateZonesHistoryAsync(
        string userId, 
        DateTime startDate, 
        DateTime endDate, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get weight history for a user within a date range
    /// </summary>
    Task<IEnumerable<WeightTimeSeries>> GetWeightHistoryAsync(
        string userId, 
        DateTime startDate, 
        DateTime endDate, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get height history for a user within a date range
    /// </summary>
    Task<IEnumerable<HeightTimeSeries>> GetHeightHistoryAsync(
        string userId, 
        DateTime startDate, 
        DateTime endDate, 
        CancellationToken cancellationToken = default);
}