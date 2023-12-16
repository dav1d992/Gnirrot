using API.DTOs;

namespace API.Interfaces;
public interface IProductRepository
{
    Task<bool> SaveAllAsync();
    Task<ProductDto> GetProductByNameAsync(string productName);
    Task<ProductDto> GetProductByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetProductsAsync();
}