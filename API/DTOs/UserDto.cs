using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserDto
{
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Token { get; set; }
}