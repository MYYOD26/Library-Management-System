namespace lms.backend.Entities;

public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? Isbn { get; set; }
    public string? Publisher { get; set; }
    public int? PublishedYear { get; set; }
    public string? Description { get; set; }
    public string? CoverUrl { get; set; }

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    /// <summary>จำนวนเล่มทั้งหมดที่ห้องสมุดมีอยู่ (เล่มที่ถูกยืมอยู่นับรวมในนี้ด้วย)</summary>
    public int TotalCopies { get; set; } = 1;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<BorrowRecord> BorrowRecords { get; set; } = new List<BorrowRecord>();
}
