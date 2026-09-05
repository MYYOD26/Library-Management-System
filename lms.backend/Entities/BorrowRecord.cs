namespace lms.backend.Entities;

public class BorrowRecord
{
    public Guid Id { get; set; }

    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;

    public Guid MemberId { get; set; }
    public Member Member { get; set; } = null!;

    public DateTime BorrowedAt { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }
}
