using System.ComponentModel.DataAnnotations;
using PhysiqubeRunning.Application.Onboarding.DTOs;
using PhysiqubeRunning.Domain.UserProfile;

namespace PhysiqubeRunning.Api.Onboarding.Contracts;

public class SaveUserInfoRequest
{
    // Optional fields
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    // Required fields
    [Required(ErrorMessage = "Date of birth is required")]
    public DateTimeOffset DateOfBirth { get; set; }
    
    [Required(ErrorMessage = "Biological sex is required")]
    public BiologicalSex BiologicalSex { get; set; }
    
    // Optional fields with validation
    [Range(30, 120, ErrorMessage = "Resting heart rate should be between 30-120 bpm")]
    public int? RestingHeartRate { get; set; }
    
    [Range(120, 220, ErrorMessage = "Maximum heart rate should be between 120-220 bpm")]
    public int? MaxHeartRate { get; set; }
    
    [Range(30, 300, ErrorMessage = "Weight should be between 30-300 kg")]
    public float? Weight { get; set; }
    
    [Range(100, 250, ErrorMessage = "Height should be between 100-250 cm")]
    public float? Height { get; set; }
    
    public FitnessLevel? FitnessLevel { get; set; }

    public OnboardingSetUserInfo ToOnBoardingSetUserInfo(string userId)
    {
        
        return new OnboardingSetUserInfo
        {
            UserIdentifier = userId,
            DateOfBirth = DateOfBirth,
            BiologicalSex = BiologicalSex,
            RestingHeartRate = RestingHeartRate,
            MaxHeartRate = MaxHeartRate,
            Weight = Weight,
            Height = Height,
            FitnessLevel = FitnessLevel
        };
    }
}