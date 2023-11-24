using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[AllowAnonymous]
public class CategoriesController : BaseApiController
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoriesController(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _categoryRepository.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("name/{categoryName}")]
    public async Task<ActionResult<Category>> GetCategoryByName(string categoryName)
    {
        return await _categoryRepository.GetCategoryByNameAsync(categoryName);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategoryById(int id)
    {
        return await _categoryRepository.GetCategoryByIdAsync(id);
    }
}