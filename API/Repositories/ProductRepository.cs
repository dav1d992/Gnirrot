using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;
public class ProductRepository : IProductRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public ProductRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProductDto> GetProductByNameAsync(string name)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .Include(p => p.Employee)
            .Include(p => p.Materials)
                .ThenInclude(m => m.MaterialType)
            .Where(x => x.Name == name)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<ProductDto> GetProductDtoByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .Include(p => p.Employee)
            .Include(p => p.Materials)
                .ThenInclude(m => m.MaterialType)
            .Where(x => x.Id == id)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<ProductDto>> GetProductsAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .Include(p => p.Employee)
            .Include(p => p.Materials)
                .ThenInclude(m => m.MaterialType)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await _context.Products.AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .Include(p => p.Employee)
            .Include(p => p.Materials)
                .ThenInclude(m => m.MaterialType).AsNoTracking()
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(Product product)
    {
        if (_context.Entry(product).State == EntityState.Detached)
        {
            _context.Products.Attach(product);
        }

        _context.Entry(product).State = EntityState.Modified;
    }

    public async Task UpdateProductWithMaterialsAsync(Product product, ProductUpdateDto productDto)
    {
        // Detach the product from the tracking context to prevent EF Core from interpreting 
        // the update as an insertion of a new relationship
        _context.Entry(product).State = EntityState.Detached;

        var updatedProduct = await _context.Products
            .Include(p => p.Materials)
            .Include(p => p.Category)
            .Include(p => p.Employee)
            .FirstOrDefaultAsync(p => p.Id == product.Id);

        if (updatedProduct != null)
        {
            if (updatedProduct.Category.Id != productDto.Category.Id)
            {
                updatedProduct.Category = productDto.Category;
            }

            if (updatedProduct.Employee.Id != productDto.Employee.Id)
            {
                updatedProduct.Employee = new AppUser
                {
                    Id = productDto.Employee.Id,
                    ShortName = productDto.Employee.ShortName,
                    FirstName = productDto.Employee.FirstName,
                    LastName = productDto.Employee.LastName,
                    DateOfBirth = productDto.Employee.DateOfBirth,
                    Joined = productDto.Employee.Joined,
                    Workplace = productDto.Employee.Workplace,
                    PhotoUrl = productDto.Employee.PhotoUrl,
                    Role = productDto.Employee.Role,
                    PasswordHash = product.Employee.PasswordHash,
                    PasswordSalt = product.Employee.PasswordSalt
                };
            }
            
            await UpdateProductMaterialsAsync(updatedProduct, productDto.Materials);

            _context.Products.Update(updatedProduct);
            await _context.SaveChangesAsync();
        }
    }


    private async Task UpdateProductMaterialsAsync(Product product, List<MaterialDto> newMaterials)
    {
        var currentMaterialIds = product.Materials.Select(m => m.Id).ToList();
        var newMaterialIds = newMaterials.Select(m => m.Id).ToList();

        var materialsToAdd = newMaterialIds.Except(currentMaterialIds);

        foreach (var materialId in materialsToAdd)
        {
            if (!product.Materials.Any(m => m.Id == materialId)) // Check if the material is already linked
            {
                var material = await _context.Materials.FindAsync(materialId);
                if (material != null)
                {
                    product.Materials.Add(material);
                }
            }
        }

        var materialsToRemove = currentMaterialIds.Except(newMaterialIds);

        foreach (var materialId in materialsToRemove)
        {
            var material = product.Materials.FirstOrDefault(m => m.Id == materialId);
            if (material != null)
            {
                product.Materials.Remove(material);
            }
        }
    }
}