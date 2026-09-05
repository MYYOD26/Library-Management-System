namespace lms.backend.Entities;

/// <summary>
/// ผู้ใช้ระบบ (สำหรับเข้าสู่ระบบ) แยกจาก Member (สมาชิกห้องสมุด)
/// Role: Admin = ดูแลทั้งหมด, Librarian = จัดการหนังสือ/สมาชิก/ยืม-คืน, Member = ดูอย่างเดียว
/// </summary>
public class AppUser
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = AppRoles.Member;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}

public static class AppRoles
{
    public const string Admin = "Admin";
    public const string Librarian = "Librarian";
    public const string Member = "Member";

    public static readonly string[] All = [Admin, Librarian, Member];
}
