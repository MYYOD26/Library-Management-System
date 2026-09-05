namespace lms.backend.Dtos;

/// <summary>สถานะรายการยืม: active = กำลังยืม, overdue = เกินกำหนด, returned = คืนแล้ว</summary>
public record BorrowingDto(
    Guid Id,
    Guid BookId,
    string BookTitle,
    string BookAuthor,
    Guid MemberId,
    string MemberName,
    string MemberCode,
    DateTime BorrowedAt,
    DateTime DueDate,
    DateTime? ReturnedAt,
    string Status);

public record BorrowRequest(Guid BookId, Guid MemberId);
