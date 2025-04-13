using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PhysiqubeRunning.Application.Abstractions.Repositories;
using PhysiqubeRunning.Domain.UserProfile;

namespace PhysiqubeRunning.Infrastructure.Data.Repositories;

public class UserPhysicalProfileRepository : IUserPhysicalProfileRepository
{
    // 1. Private fields
    private readonly PhysiqubeDbContext _context;
    
    // 2. Constants - none
    
    // 3. Public constructors
    public UserPhysicalProfileRepository(PhysiqubeDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }
    
    // 4. Private constructors - none
    
    // 5. Properties - none
    
    // 6. Public methods
    public async Task<UserPhysicalProfile?> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<UserPhysicalProfile>()
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);
    }
    
    public async Task<UserPhysicalProfile> AddAsync(UserPhysicalProfile profile, CancellationToken cancellationToken = default)
    {
        _context.Set<UserPhysicalProfile>().Add(profile);
        await _context.SaveChangesAsync(cancellationToken);
        return profile;
    }
    
    public async Task<UserPhysicalProfile> UpdateAsync(UserPhysicalProfile profile, CancellationToken cancellationToken = default)
    {
        _context.Set<UserPhysicalProfile>().Update(profile);
        await _context.SaveChangesAsync(cancellationToken);
        return profile;
    }
    
    public async Task<bool> ExistsAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<UserPhysicalProfile>()
            .AnyAsync(x => x.UserId == userId, cancellationToken);
    }
    
    // 7. Private methods - none
}