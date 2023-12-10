using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("MaterialCategory")]
public class MaterialCategory
{
    public int Id { get; set; }
    public string Name { get; set; }
}