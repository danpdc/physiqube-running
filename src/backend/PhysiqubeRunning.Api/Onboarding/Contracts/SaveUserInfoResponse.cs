using PhysiqubeRunning.Application.Onboarding.DTOs;

namespace PhysiqubeRunning.Api.Onboarding.Contracts;

public class SaveUserInfoResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public int? MaxHeartRate { get; set; }
    public int? RestingHeartRate { get; set; }
    public string? UserId { get; set; }
    public float? EstimatedBmi { get; set; }

    public static SaveUserInfoResponse FromServiceResult(OnboardingSetUserInfoResult result)
    {
        
        return new SaveUserInfoResponse
        {
            Success = result.Success,
            Message = result.Message,
            MaxHeartRate = result.MaxHeartRate,
            RestingHeartRate = result.RestingHeartRate,
            UserId = result.UserId,
            EstimatedBmi = result.EstimatedBmi
        };
    }
}