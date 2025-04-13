namespace PhysiqubeRunning.Application.Onboarding.DTOs;

public class OnboardingSetUserInfoResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public int? MaxHeartRate { get; set; }
    public int? RestingHeartRate { get; set; }
    public string? UserId { get; set; }
    public float? EstimatedBmi { get; set; }
}