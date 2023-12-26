
using API.Entities;

namespace API.DTOs;
public class MaterialDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public string AmountInStock { get; set; }
    public string MaterialTypeName { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int Length { get; set; }
    public MaterialType MaterialType { get; set; }
}