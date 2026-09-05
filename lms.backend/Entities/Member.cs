namespace lms.backend.Entities;

public class Member
{
    public Guid Id { get; set; }

    /// <summary>รหัสสมาชิก เช่น LIB-0001 (สร้างอัตโนมัติ)</summary>
    public string MemberCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime JoinDate { get; set; }

    public ICollection<BorrowRecord> BorrowRecords { get; set; } = new List<BorrowRecord>();
}
