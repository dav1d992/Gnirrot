using API.DTOs;

namespace API.Interfaces;
public interface IMaterialRepository
{
    Task<bool> SaveAllAsync();
    Task<MaterialDto> GetMaterialByNameAsync(string materialName);
    Task<MaterialDto> GetMaterialByIdAsync(int id);
    Task<IEnumerable<MaterialDto>> GetMaterialsAsync();
}