using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("MaterialType")]
public class MaterialType
{
    public int Id { get; set; }
    public string Name { get; set; }
}