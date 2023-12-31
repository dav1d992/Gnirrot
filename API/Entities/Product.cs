using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Products")]
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public string PhotoUrl { get; set; }
    public List<Photo> Photos { get; set; } = new();
    public List<Material> Materials { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime Started { get; set; }
    public DateTime Ended { get; set; }
    public AppUser Employee { get; set; }
    public Category Category { get; set; }
}