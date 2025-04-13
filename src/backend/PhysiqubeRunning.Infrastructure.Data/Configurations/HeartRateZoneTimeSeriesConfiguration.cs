using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PhysiqubeRunning.Domain.Metrics;

namespace PhysiqubeRunning.Infrastructure.Data.Configurations;

public class HeartRateZoneTimeSeriesConfiguration : IEntityTypeConfiguration<HeartRateZonesTimeSeries>
{
    public void Configure(EntityTypeBuilder<HeartRateZonesTimeSeries> builder)
    {
        builder.HasKey(x => x.Id); 
        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();
    }
}