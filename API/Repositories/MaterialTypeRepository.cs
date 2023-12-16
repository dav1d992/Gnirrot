using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;
public class MaterialTypeRepository : IMaterialTypeRepository
{
    private readonly DataContext _context;
    public MaterialTypeRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<MaterialType> GetMaterialTypeByNameAsync(string materialTypeName)
    {
        return await _context.MaterialTypes
            .Where(x => x.Name == materialTypeName)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MaterialType>> GetMaterialTypesAsync()
    {
        return await _context.MaterialTypes.ToListAsync();
    }

    public async Task<MaterialType> GetMaterialTypeByIdAsync(int id)
    {
        return await _context.MaterialTypes.FindAsync(id);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}