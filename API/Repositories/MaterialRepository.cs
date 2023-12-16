using API.Data;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;
public class MaterialRepository : IMaterialRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public MaterialRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<MaterialDto> GetMaterialByNameAsync(string name)
    {
        return await _context.Products
            .Where(x => x.Name == name)
            .ProjectTo<MaterialDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<MaterialDto> GetMaterialByIdAsync(int id)
    {
        return await _context.Products
            .Where(x => x.Id == id)
            .ProjectTo<MaterialDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MaterialDto>> GetMaterialsAsync()
    {
        return await _context.Products
            .ProjectTo<MaterialDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}