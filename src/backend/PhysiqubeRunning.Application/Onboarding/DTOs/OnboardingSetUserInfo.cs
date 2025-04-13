using PhysiqubeRunning.Domain.UserProfile;

namespace PhysiqubeRunning.Application.Onboarding.DTOs;

public class OnboardingSetUserInfo
{
    public required string UserIdentifier { get; set; } 
    public DateTimeOffset DateOfBirth { get; set; }
    public BiologicalSex BiologicalSex { get; set; }
    
    public int? RestingHeartRate { get; set; }
    
    public int? MaxHeartRate { get; set; }
    
    public float? Weight { get; set; }
    
    public float? Height { get; set; }
    
    public FitnessLevel? FitnessLevel { get; set; }
}