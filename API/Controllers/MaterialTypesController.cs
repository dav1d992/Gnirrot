using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[AllowAnonymous]
public class MaterialTypesController : BaseApiController
{
    private readonly IMaterialTypeRepository _materialTypeRepository;

    public MaterialTypesController(IMaterialTypeRepository materialTypeRepository)
    {
        _materialTypeRepository = materialTypeRepository;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaterialType>>> GetMaterialTypes()
    {
        var categories = await _materialTypeRepository.GetMaterialTypesAsync();
        return Ok(categories);
    }

    [HttpGet("name/{materialTypeName}")]
    public async Task<ActionResult<MaterialType>> GetMaterialTypeByName(string materialTypeName)
    {
        return await _materialTypeRepository.GetMaterialTypeByNameAsync(materialTypeName);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialType>> GetMaterialTypeById(int id)
    {
        return await _materialTypeRepository.GetMaterialTypeByIdAsync(id);
    }
}