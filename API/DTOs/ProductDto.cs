
using API.Entities;

namespace API.DTOs;
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public string PhotoUrl { get; set; }
    public string CategoryName { get; set; }
    public Category Category { get; set; }
    public List<PhotoDto> Photos { get; set; }
    public List<Material> Materials { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime Started { get; set; }
    public DateTime Ended { get; set; }
    public AppUser Employee { get; set; }
}