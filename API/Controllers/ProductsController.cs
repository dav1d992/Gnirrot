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
        return await _productRepository.GetProductByIdAsync(id);
    }
}