using API.DTOs;
using API.Entities;

namespace API.Interfaces;
public interface IProductRepository
{
    Task<bool> SaveAllAsync();
    Task<ProductDto> GetProductByNameAsync(string productName);
    Task<Product> GetProductByIdAsync(int id);
    Task<ProductDto> GetProductDtoByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetProductsAsync();
    void Update(Product product);
    public Task UpdateProductWithMaterialsAsync(Product product, ProductUpdateDto productDto);

}