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
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Photos)
            .Include(p => p.Employee)
            .Include(p => p.Materials)
                .ThenInclude(m => m.MaterialType)
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(Product product)
    {
        _context.Entry(product).State = EntityState.Modified;
    }


    public void UpdateProductMaterials(Product product, List<MaterialDto> materialDtos)
    {
        // Assuming there's a collection in Product that holds the relationship with Materials
        // This could be a list of IDs, a join entity, etc.

        // First, remove materials that are no longer associated
        var currentMaterialIds = product.Materials.Select(m => m.Id).ToList();
        var newMaterialIds = materialDtos.Select(m => m.Id);
        var materialIdsToRemove = currentMaterialIds.Except(newMaterialIds).ToList();

        foreach (var materialId in materialIdsToRemove)
        {
            var materialToRemove = product.Materials.FirstOrDefault(m => m.Id == materialId);
            if (materialToRemove != null)
            {
                product.Materials.Remove(materialToRemove);
            }
        }

        // Then, add or update the existing materials
        foreach (var materialDto in materialDtos)
        {
            var existingMaterial = product.Materials.FirstOrDefault(m => m.Id == materialDto.Id);
            if (existingMaterial != null)
            {
                _mapper.Map(materialDto, existingMaterial);
            }
            else
            {
                var newMaterial = _mapper.Map<Material>(materialDto);
                product.Materials.Add(newMaterial);
            }
        }
    }
}