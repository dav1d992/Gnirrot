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

        var materialTypeData = await File.ReadAllTextAsync("Data/Seed/MaterialTypeSeedData.json");
        var materialData = await File.ReadAllTextAsync("Data/Seed/MaterialSeedData.json");
        var categoryData = await File.ReadAllTextAsync("Data/Seed/CategorySeedData.json");
        var productData = await File.ReadAllTextAsync("Data/Seed/ProductSeedData.json");
        var roleData = await File.ReadAllTextAsync("Data/Seed/RoleSeedData.json");
        var userData = await File.ReadAllTextAsync("Data/Seed/UserSeedData.json");

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var materialTypes = JsonSerializer.Deserialize<List<MaterialType>>(materialTypeData, options);
        var materials = JsonSerializer.Deserialize<List<Material>>(materialData, options);
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
            product.Category = categories.FirstOrDefault(category => category.Name == product.Category.Name);
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
            if (user.ShortName == "lis")
            {
                user.Role = roles[0]; // Admin 
            }
            else if (user.ShortName == "anp")
            {
                user.Role = roles[1]; // Employer 
            }
            else
            {
                user.Role = roles[2]; // Employee 
            }
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt = hmac.Key;

            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
    }
}