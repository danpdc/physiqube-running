
using Microsoft.EntityFrameworkCore;
using PhysiqubeRunning.Application.Abstractions.Repositories;
using PhysiqubeRunning.Domain.Metrics;

namespace PhysiqubeRunning.Infrastructure.Data.Repositories;

public class MetricsTimeSeriesRepository : IMetricsTimeSeriesRepository
{
    // 1. Private fields
    private readonly PhysiqubeDbContext _context;
    
    // 2. Constants - none
    
    // 3. Public constructors
    public MetricsTimeSeriesRepository(PhysiqubeDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }
    
    // 4. Private constructors - none
    
    // 5. Properties - none
    
    // 6. Public methods
    public async Task<HeartRateZonesTimeSeries> AddHeartRateZonesAsync(string userId, HeartRateZones zones, CancellationToken cancellationToken = default)
    {
        var entry = new HeartRateZonesTimeSeries(userId, zones);
        _context.Set<HeartRateZonesTimeSeries>().Add(entry);
        await _context.SaveChangesAsync(cancellationToken);
        return entry;
    }
    
    public async Task<WeightTimeSeries> AddWeightAsync(string userId, int weightInGrams, CancellationToken cancellationToken = default)
    {
        var entry = new WeightTimeSeries(userId, weightInGrams);
        _context.Set<WeightTimeSeries>().Add(entry);
        await _context.SaveChangesAsync(cancellationToken);
        return entry;
    }
    
    public async Task<HeightTimeSeries> AddHeightAsync(string userId, int heightInMillimeters, CancellationToken cancellationToken = default)
    {
        var entry = new HeightTimeSeries(userId, heightInMillimeters);
        _context.Set<HeightTimeSeries>().Add(entry);
        await _context.SaveChangesAsync(cancellationToken);
        return entry;
    }
    
    public async Task<HeartRateZonesTimeSeries?> GetLatestHeartRateZonesAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<HeartRateZonesTimeSeries>()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.RecordedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    public async Task<WeightTimeSeries?> GetLatestWeightAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<WeightTimeSeries>()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.RecordedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    public async Task<HeightTimeSeries?> GetLatestHeightAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<HeightTimeSeries>()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.RecordedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<HeartRateZonesTimeSeries>> GetHeartRateZonesHistoryAsync(string userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Set<HeartRateZonesTimeSeries>()
            .Where(x => x.UserId == userId && x.RecordedAt >= startDate && x.RecordedAt <= endDate)
            .OrderBy(x => x.RecordedAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<WeightTimeSeries>> GetWeightHistoryAsync(string userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Set<WeightTimeSeries>()
            .Where(x => x.UserId == userId && x.RecordedAt >= startDate && x.RecordedAt <= endDate)
            .OrderBy(x => x.RecordedAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<HeightTimeSeries>> GetHeightHistoryAsync(string userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Set<HeightTimeSeries>()
            .Where(x => x.UserId == userId && x.RecordedAt >= startDate && x.RecordedAt <= endDate)
            .OrderBy(x => x.RecordedAt)
            .ToListAsync(cancellationToken);
    }
    
    // 7. Private methods - none
}