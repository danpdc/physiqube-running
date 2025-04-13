using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PhysiqubeRunning.Domain.Metrics;

namespace PhysiqubeRunning.Infrastructure.Data.Configurations;

public class WeightTimeSeriesConfiguration : IEntityTypeConfiguration<WeightTimeSeries>
{
    public void Configure(EntityTypeBuilder<WeightTimeSeries> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();
            
        builder.Property(x => x.UserId)
            .IsRequired();
            
        builder.Property(x => x.WeightInGrams)
            .IsRequired();
            
        builder.Property(x => x.RecordedAt)
            .IsRequired();
            
        // Create an index on UserId for quicker lookups
        builder.HasIndex(x => x.UserId);
        
        // Create a compound index on UserId and RecordedAt for quicker time-series queries
        builder.HasIndex(x => new { x.UserId, x.RecordedAt });
        
        // Table name
        builder.ToTable("WeightHistory");
    }
}