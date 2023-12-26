using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[AllowAnonymous]
public class MaterialsController : BaseApiController
{
    private readonly IMaterialRepository _materialRepository;
    public IMapper _mapper;

    public MaterialsController(IMaterialRepository materialRepository, IMapper mapper)
    {
        _mapper = mapper;
        _materialRepository = materialRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Material>>> GetMaterials()
    {
        var materials = await _materialRepository.GetMaterialsAsync();
        return Ok(materials);
    }

    [HttpGet("name/{materialName}")]
    public async Task<ActionResult<MaterialDto>> GetMaterialByName(string materialName)
    {
        return await _materialRepository.GetMaterialByNameAsync(materialName);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialDto>> GetMaterialById(int id)
    {
        return await _materialRepository.GetMaterialByIdAsync(id);
    }
}