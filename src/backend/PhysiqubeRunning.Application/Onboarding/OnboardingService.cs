using PhysiqubeRunning.Application.Abstractions.Repositories;
using PhysiqubeRunning.Application.Onboarding.DTOs;
using PhysiqubeRunning.Domain.Metrics;
using PhysiqubeRunning.Domain.UserProfile;

namespace PhysiqubeRunning.Application.Onboarding;

public class OnboardingService
{
    private readonly IUserPhysicalProfileRepository _userPhysicalProfileRepository;
    private readonly IMetricsTimeSeriesRepository _metricsTimeSeriesRepository;
    private readonly HeartRateZoneCalculator _heartRateZoneCalculator;

    public OnboardingService(
        IUserPhysicalProfileRepository userPhysicalProfileRepository,
        IMetricsTimeSeriesRepository metricsTimeSeriesRepository)
    {
        _userPhysicalProfileRepository = userPhysicalProfileRepository;
        _metricsTimeSeriesRepository = metricsTimeSeriesRepository;
        _heartRateZoneCalculator = new HeartRateZoneCalculator();
    }

    public async Task<OnboardingSetUserInfoResult> OnboardUserAsync(OnboardingSetUserInfo request, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            // 1. Convert input values:
            // - Height from meters to millimeters (multiply by 1000)
            // - Weight from kilograms to grams (multiply by 1000)
            int? heightInMillimeters = null;
            int? weightInGrams = null;
            
            if (request.Height.HasValue)
            {
                // Convert from meters to millimeters (multiply by 1000)
                heightInMillimeters = (int)(request.Height.Value * 1000);
            }
            
            if (request.Weight.HasValue)
            {
                // Convert from kilograms to grams (multiply by 1000)
                weightInGrams = (int)(request.Weight.Value * 1000);
            }
            
            // 2. Determine max and resting heart rates
            int maxHeartRate = request.MaxHeartRate ?? 
                _heartRateZoneCalculator.EstimateMaxHeartRate(
                    CalculateAge(request.DateOfBirth));
                
            // 3. Create or update the user physical profile
            UserPhysicalProfile userProfile;
            var existingProfile = await _userPhysicalProfileRepository.GetByUserIdAsync(
                request.UserIdentifier, cancellationToken);
                
            if (existingProfile == null)
            {
                // Create new profile
                userProfile = new UserPhysicalProfile(
                    request.UserIdentifier,
                    request.DateOfBirth.DateTime,
                    request.BiologicalSex,
                    heightInMillimeters ?? 0,
                    weightInGrams ?? 0,
                    maxHeartRate,
                    request.RestingHeartRate,
                    request.FitnessLevel ?? FitnessLevel.NotSpecified);
                    
                userProfile = await _userPhysicalProfileRepository.AddAsync(userProfile, cancellationToken);
            }
            else
            {
                // Update existing profile with new values
                if (heightInMillimeters.HasValue)
                {
                    existingProfile.UpdateHeight(heightInMillimeters.Value);
                }
                
                if (weightInGrams.HasValue)
                {
                    existingProfile.UpdateWeight(weightInGrams.Value);
                }
                
                existingProfile.SetHeartRates(maxHeartRate, request.RestingHeartRate);
                
                if (request.FitnessLevel.HasValue)
                {
                    existingProfile.UpdateFitnessLevel(request.FitnessLevel.Value);
                }
                
                userProfile = await _userPhysicalProfileRepository.UpdateAsync(existingProfile, cancellationToken);
            }
            
            // 4. Calculate heart rate zones
            var heartRateZones = _heartRateZoneCalculator.Calculate(
                maxHeartRate, request.RestingHeartRate);
                
            // 5. Add time series entries
            await _metricsTimeSeriesRepository.AddHeartRateZonesAsync(
                request.UserIdentifier, heartRateZones, cancellationToken);
                
            if (heightInMillimeters.HasValue)
            {
                await _metricsTimeSeriesRepository.AddHeightAsync(
                    request.UserIdentifier, heightInMillimeters.Value, cancellationToken);
            }
            
            if (weightInGrams.HasValue)
            {
                await _metricsTimeSeriesRepository.AddWeightAsync(
                    request.UserIdentifier, weightInGrams.Value, cancellationToken);
            }
            
            // 6. Calculate BMI (only if we have both height and weight)
            float? estimatedBmi = null;
            if (heightInMillimeters.HasValue && heightInMillimeters.Value > 0 &&
                weightInGrams.HasValue && weightInGrams.Value > 0)
            {
                estimatedBmi = (float)userProfile.CalculateBMI();
            }
            
            // Return a result with all the relevant information
            return new OnboardingSetUserInfoResult
            {
                Success = true,
                Message = "User onboarded successfully.",
                MaxHeartRate = maxHeartRate,
                RestingHeartRate = request.RestingHeartRate,
                UserId = request.UserIdentifier,
                EstimatedBmi = estimatedBmi
            };
        }
        catch (Exception ex)
        {
            // Log the exception (would typically use a logger here)
            
            return new OnboardingSetUserInfoResult
            {
                Success = false,
                Message = $"Failed to onboard user: {ex.Message}"
            };
        }
    }
    
    private int CalculateAge(DateTimeOffset dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;
        
        // Adjust age if birthday hasn't occurred yet this year
        if (dateOfBirth.Date > today.AddYears(-age))
        {
            age--;
        }
        
        return age;
    }
}