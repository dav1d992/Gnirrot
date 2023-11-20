using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Products")]
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public Category Category { get; set; }
    public List<Photo> Photos { get; set; } = new();
}