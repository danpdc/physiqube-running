using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PhysiqubeRunning.Domain.Users;

namespace PhysiqubeRunning.Infrastructure.Data.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplicationBuilder AddPersistence(this WebApplicationBuilder builder)
    {
        var cs = builder.Configuration.GetConnectionString("DefaultConnection");
        
        // Add services to the container.
        builder.Services.AddDbContext<PhysiqubeDbContext>(options =>
            options.UseSqlServer(cs));

        // Add Identity
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddUserManager<UserManager<ApplicationUser>>()
            .AddRoleManager<RoleManager<IdentityRole>>()
            .AddEntityFrameworkStores<PhysiqubeDbContext>()
            .AddDefaultTokenProviders();

        return builder;
    }
}