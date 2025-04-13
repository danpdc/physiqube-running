using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PhysiqubeRunning.Domain.UserProfile;

namespace PhysiqubeRunning.Infrastructure.Data.Configurations;

public class UserPhysicalProfileConfiguration : IEntityTypeConfiguration<UserPhysicalProfile>
{
    public void Configure(EntityTypeBuilder<UserPhysicalProfile> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();
            
        builder.Property(x => x.UserId)
            .IsRequired();
            
        builder.Property(x => x.DateOfBirth)
            .IsRequired();
            
        builder.Property(x => x.BiologicalSex)
            .IsRequired();
            
        builder.Property(x => x.HeightInMillimeters)
            .IsRequired();
            
        builder.Property(x => x.WeightInGrams)
            .IsRequired();
            
        builder.Property(x => x.MaxHeartRate)
            .IsRequired();
            
        builder.Property(x => x.LastUpdated)
            .IsRequired();
            
        // Set up relationship with ApplicationUser
        builder.HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<UserPhysicalProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Create a unique index on UserId
        builder.HasIndex(x => x.UserId)
            .IsUnique();
            
        // Table name
        builder.ToTable("UserPhysicalProfiles");
    }
}