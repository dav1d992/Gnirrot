using API.Entities;

namespace API.DTOs;
public class MemberDto
{
    public int Id { get; set; }
    public string ShortName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public DateTime Joined { get; set; }
    public string Workplace { get; set; }
    public string PhotoUrl { get; set; }
    public Role Role { get; set; }
}