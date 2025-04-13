using System;
using PhysiqubeRunning.Domain.Users;

namespace PhysiqubeRunning.Domain.UserProfile;

/// <summary>
/// Represents a user's physical profile data collected during onboarding
/// </summary>
public class UserPhysicalProfile
{
    // 1. Private fields - none

    // 2. Constants - none

    // 3. Public constructors
    /// <summary>
    /// Creates a new user physical profile
    /// </summary>
    public UserPhysicalProfile(
        string userId,
        DateTime dateOfBirth,
        BiologicalSex biologicalSex,
        int heightInMillimeters,
        int weightInGrams,
        int maxHeartRate,
        int? restingHeartRate = null,
        FitnessLevel fitnessLevel = FitnessLevel.NotSpecified)
    {
        UserId = userId ?? throw new ArgumentNullException(nameof(userId));
        DateOfBirth = dateOfBirth;
        BiologicalSex = biologicalSex;
        HeightInMillimeters = heightInMillimeters;
        WeightInGrams = weightInGrams;
        SetHeartRates(maxHeartRate, restingHeartRate);
        FitnessLevel = fitnessLevel;
        LastUpdated = DateTime.UtcNow;
    }

    // 4. Private constructors
    // For EF Core
    private UserPhysicalProfile() { }

    // 5. Properties
    /// <summary>
    /// Unique identifier for the physical profile
    /// </summary>
    public Guid Id { get; private set; }
    
    /// <summary>
    /// The ID of the user this profile belongs to
    /// </summary>
    public string UserId { get; private set; }
    
    /// <summary>
    /// Navigation property to the application user
    /// </summary>
    public ApplicationUser User { get; private set; }
    
    /// <summary>
    /// User's date of birth
    /// </summary>
    public DateTime DateOfBirth { get; private set; }
    
    /// <summary>
    /// User's biological sex
    /// </summary>
    public BiologicalSex BiologicalSex { get; private set; }
    
    /// <summary>
    /// User's current height in millimeters
    /// </summary>
    public int HeightInMillimeters { get; private set; }
    
    /// <summary>
    /// User's current weight in grams
    /// </summary>
    public int WeightInGrams { get; private set; }
    
    /// <summary>
    /// User's max heart rate
    /// </summary>
    public int MaxHeartRate { get; private set; }
    
    /// <summary>
    /// User's resting heart rate
    /// </summary>
    public int? RestingHeartRate { get; private set; }
    
    /// <summary>
    /// User's self-assessed fitness level
    /// </summary>
    public FitnessLevel FitnessLevel { get; private set; }
    
    /// <summary>
    /// When the profile was last updated
    /// </summary>
    public DateTime LastUpdated { get; private set; }

    /// <summary>
    /// Calculate the user's age based on date of birth
    /// </summary>
    public int Age
    {
        get
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;
            
            // Adjust age if birthday hasn't occurred yet this year
            if (DateOfBirth.Date > today.AddYears(-age)) 
                age--;
                
            return age;
        }
    }
    
    /// <summary>
    /// Get height in centimeters
    /// </summary>
    public decimal HeightInCentimeters => HeightInMillimeters / 10.0m;
    
    /// <summary>
    /// Get height in inches
    /// </summary>
    public decimal HeightInInches => HeightInMillimeters / 25.4m;
    
    /// <summary>
    /// Get weight in kilograms
    /// </summary>
    public decimal WeightInKilograms => WeightInGrams / 1000.0m;
    
    /// <summary>
    /// Get weight in pounds
    /// </summary>
    public decimal WeightInPounds => WeightInGrams / 453.59237m;

    // 6. Public methods
    /// <summary>
    /// Update the user's height
    /// </summary>
    public void UpdateHeight(int heightInMillimeters)
    {
        if (heightInMillimeters <= 0)
            throw new ArgumentException("Height must be greater than zero", nameof(heightInMillimeters));
            
        HeightInMillimeters = heightInMillimeters;
        LastUpdated = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Update the user's weight
    /// </summary>
    public void UpdateWeight(int weightInGrams)
    {
        if (weightInGrams <= 0)
            throw new ArgumentException("Weight must be greater than zero", nameof(weightInGrams));
            
        WeightInGrams = weightInGrams;
        LastUpdated = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Update the user's heart rates
    /// </summary>
    public void SetHeartRates(int maxHeartRate, int? restingHeartRate = null)
    {
        if (maxHeartRate <= 0)
            throw new ArgumentException("Max heart rate must be greater than zero", nameof(maxHeartRate));
            
        if (restingHeartRate.HasValue && restingHeartRate.Value <= 0)
            throw new ArgumentException("Resting heart rate must be greater than zero", nameof(restingHeartRate));
            
        if (restingHeartRate.HasValue && restingHeartRate.Value >= maxHeartRate)
            throw new ArgumentException("Resting heart rate must be less than max heart rate", nameof(restingHeartRate));
            
        MaxHeartRate = maxHeartRate;
        RestingHeartRate = restingHeartRate;
        LastUpdated = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Update the user's fitness level
    /// </summary>
    public void UpdateFitnessLevel(FitnessLevel fitnessLevel)
    {
        FitnessLevel = fitnessLevel;
        LastUpdated = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Calculate the user's Body Mass Index (BMI)
    /// </summary>
    public decimal CalculateBMI()
    {
        // BMI = weight(kg) / height(m)²
        var heightInMeters = HeightInMillimeters / 1000m;
        return Math.Round(WeightInKilograms / (heightInMeters * heightInMeters), 1);
    }

    /// <summary>
    /// Estimate max heart rate based on age if not explicitly provided
    /// </summary>
    public static int EstimateMaxHeartRate(int age)
    {
        // Common formula: 220 - age
        return 220 - age;
    }
    
    // 7. Private methods - none
}