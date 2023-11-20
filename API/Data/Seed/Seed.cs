using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(DataContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var categoryData = await File.ReadAllTextAsync("Data/Seed/CategorySeedData.json");
        var productData = await File.ReadAllTextAsync("Data/Seed/ProductSeedData.json");
        var roleData = await File.ReadAllTextAsync("Data/Seed/RoleSeedData.json");
        var userData = await File.ReadAllTextAsync("Data/Seed/UserSeedData.json");

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var categories = JsonSerializer.Deserialize<List<Category>>(categoryData, options);
        var products = JsonSerializer.Deserialize<List<Product>>(productData, options);
        var roles = JsonSerializer.Deserialize<List<Role>>(roleData, options);
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        foreach (var category in categories)
        {
            context.Categories.Add(category);
        }

        foreach (var product in products)
        {
            product.Category = categories[1];
            context.Products.Add(product);
        }

        foreach (var role in roles)
        {
            context.Roles.Add(role);
        }

        foreach (var user in users)
        {
            using var hmac = new HMACSHA512();

            user.ShortName = user.ShortName.ToLower();
            user.Role = roles[0];
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt = hmac.Key;

            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
    }
}