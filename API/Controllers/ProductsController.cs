using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[AllowAnonymous]
public class ProductsController : BaseApiController
{
    private readonly IProductRepository _productRepository;
    public IMapper _mapper;

    public ProductsController(IProductRepository productRepository, IMapper mapper)
    {
        _mapper = mapper;
        _productRepository = productRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _productRepository.GetProductsAsync();
        return Ok(products);
    }

    [HttpGet("name/{productName}")]
    public async Task<ActionResult<ProductDto>> GetProductByName(string productName)
    {
        return await _productRepository.GetProductByNameAsync(productName);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id)
    {
        return await _productRepository.GetProductDtoByIdAsync(id);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProduct(ProductDto productDto)
    {
        try
        {
            var product = await _productRepository.GetProductByIdAsync(productDto.Id);
            if (product == null) return NotFound();

            _mapper.Map(productDto, product);

            if (await _productRepository.SaveAllAsync()) return NoContent();
        }
        catch (Exception ex)
        {
            // Log the exception details
            // For example: _logger.LogError(ex, "Error updating product with ID {ProductId}", productDto.Id);
            return BadRequest($"Failed to update product: {ex.Message}");
        }

        return BadRequest("Failed to update product");
    }
}
