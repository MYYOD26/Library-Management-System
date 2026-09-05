namespace lms.backend;

/// <summary>กฎการยืม-คืนของห้องสมุด ตั้งค่าได้จาก appsettings.json หัวข้อ "Borrowing"</summary>
public class LibrarySettings
{
    public const string SectionName = "Borrowing";

    /// <summary>จำนวนวันสูงสุดต่อการยืม 1 ครั้ง</summary>
    public int LoanPeriodDays { get; set; } = 14;

    /// <summary>จำนวนเล่มสูงสุดที่สมาชิก 1 คนยืมค้างได้พร้อมกัน</summary>
    public int MaxActiveLoansPerMember { get; set; } = 3;
}
