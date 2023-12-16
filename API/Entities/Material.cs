using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Material")]
public class Material
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public int AmountInStock { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int Length { get; set; }
    public MaterialType MaterialType { get; set; }
}