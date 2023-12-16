namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string ShortName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public DateTime Joined { get; set; } = DateTime.UtcNow;
        public string Workplace { get; set; }
        public string PhotoUrl { get; set; }
        public Role Role { get; set; }
    }
}