using API.Entities;

namespace API.DTOs;
public class MemberUpdateDto
{
    public string ShortName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string Workplace { get; set; }
    public Role Role { get; set; }
}