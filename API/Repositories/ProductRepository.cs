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
        // Attach the product if it's not already tracked
        if (_context.Entry(product).State == EntityState.Detached)
        {
            _context.Products.Attach(product);
        }

        // EF Core automatically tracks changes to navigation properties
        // so there's no need to manually set the state for each material
        _context.Entry(product).State = EntityState.Modified;
    }

}