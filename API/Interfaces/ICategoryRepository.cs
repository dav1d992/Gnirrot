using API.Entities;

namespace API.Interfaces;
public interface ICategoryRepository
{
    Task<bool> SaveAllAsync();
    Task<Category> GetCategoryByNameAsync(string categoryName);
    Task<Category> GetCategoryByIdAsync(int id);
    Task<IEnumerable<Category>> GetCategoriesAsync();
}