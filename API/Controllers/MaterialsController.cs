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

    [HttpGet("name/{productName}")]
    public async Task<ActionResult<MaterialDto>> GetMaterialByName(string productName)
    {
        return await _materialRepository.GetMaterialByNameAsync(productName);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialDto>> GettMaterialById(int id)
    {
        return await _materialRepository.GetMaterialByIdAsync(id);
    }
}