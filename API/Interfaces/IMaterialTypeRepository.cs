using API.Entities;

namespace API.Interfaces;
public interface IMaterialTypeRepository
{
    Task<bool> SaveAllAsync();
    Task<MaterialType> GetMaterialTypeByNameAsync(string materialTypeName);
    Task<MaterialType> GetMaterialTypeByIdAsync(int id);
    Task<IEnumerable<MaterialType>> GetMaterialTypesAsync();
}