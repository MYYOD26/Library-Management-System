using lms.backend.Data;
using Microsoft.AspNetCore.Authorization;
using lms.backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace lms.backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BorrowingsController(AppDbContext db, IOptions<LibrarySettings> settings) : ControllerBase
{
    private const string StatusActive = "active";
    private const string StatusOverdue = "overdue";
    private const string StatusReturned = "returned";

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BorrowingDto>>> GetBorrowings(
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] int limit = 200)
    {
        var query = db.BorrowRecords
            .Include(r => r.Book)
            .Include(r => r.Member)
            .AsQueryable();

        switch (status)
        {
            case StatusActive:
                query = query.Where(r => r.ReturnedAt == null);
                break;
            case StatusOverdue:
                query = query.Where(r => r.ReturnedAt == null && r.DueDate < DateTime.UtcNow);
                break;
            case StatusReturned:
                query = query.Where(r => r.ReturnedAt != null);
                break;
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(r =>
                EF.Functions.ILike(r.Book.Title, term) ||
                EF.Functions.ILike(r.Member.FullName, term) ||
                EF.Functions.ILike(r.Member.MemberCode, term));
        }

        var records = await query
            .OrderByDescending(r => r.BorrowedAt)
            .Take(Math.Clamp(limit, 1, 500))
            .ToListAsync();

        var now = DateTime.UtcNow;
        var items = records.Select(r => new BorrowingDto(
            r.Id,
            r.BookId,
            r.Book.Title,
            r.Book.Author,
            r.MemberId,
            r.Member.FullName,
            r.Member.MemberCode,
            r.BorrowedAt,
            r.DueDate,
            r.ReturnedAt,
            ResolveStatus(r.ReturnedAt, r.DueDate, now))).ToList();

        return Ok(items);
    }

    /// <summary>ยืมหนังสือ: ตรวจเงื่อนไขสมาชิกและความพร้อมของเล่ม แล้วบันทึกรายการยืม</summary>
    [Authorize(Roles = "Admin,Librarian")]
    [HttpPost("borrow")]
    public async Task<ActionResult<BorrowingDto>> Borrow(BorrowRequest request)
    {
        var member = await db.Members.FindAsync(request.MemberId);
        if (member is null)
        {
            return NotFound(new { message = "ไม่พบสมาชิกที่ระบุ" });
        }
        if (!member.IsActive)
        {
            return Conflict(new { message = "สมาชิกนี้อยู่ในสถานะปิดการใช้งาน ไม่สามารถยืมได้" });
        }

        var book = await db.Books.FindAsync(request.BookId);
        if (book is null)
        {
            return NotFound(new { message = "ไม่พบหนังสือที่ระบุ" });
        }

        var activeLoansForMember = await db.BorrowRecords.CountAsync(r => r.MemberId == member.Id && r.ReturnedAt == null);
        if (activeLoansForMember >= settings.Value.MaxActiveLoansPerMember)
        {
            return Conflict(new { message = $"สมาชิกยืมครบจำนวนสูงสุดแล้ว ({settings.Value.MaxActiveLoansPerMember} เล่ม)" });
        }

        var activeLoansForBook = await db.BorrowRecords.CountAsync(r => r.BookId == book.Id && r.ReturnedAt == null);
        if (activeLoansForBook >= book.TotalCopies)
        {
            return Conflict(new { message = "หนังสือถูกยืมครบทุกเล่มแล้ว กรุณารอรับคืน" });
        }

        var now = DateTime.UtcNow;
        var record = new Entities.BorrowRecord
        {
            Id = Guid.NewGuid(),
            BookId = book.Id,
            MemberId = member.Id,
            BorrowedAt = now,
            DueDate = now.AddDays(settings.Value.LoanPeriodDays)
        };

        db.BorrowRecords.Add(record);
        await db.SaveChangesAsync();

        var dto = new BorrowingDto(record.Id, book.Id, book.Title, book.Author,
            member.Id, member.FullName, member.MemberCode,
            record.BorrowedAt, record.DueDate, record.ReturnedAt, StatusActive);

        return CreatedAtAction(nameof(GetBorrowings), dto);
    }

    /// <summary>รับคืนหนังสือตามรหัสรายการยืม</summary>
    [Authorize(Roles = "Admin,Librarian")]
    [HttpPost("{id:guid}/return")]
    public async Task<ActionResult<BorrowingDto>> Return(Guid id)
    {
        var record = await db.BorrowRecords
            .Include(r => r.Book)
            .Include(r => r.Member)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (record is null)
        {
            return NotFound(new { message = "ไม่พบรายการยืมที่ระบุ" });
        }
        if (record.ReturnedAt is not null)
        {
            return Conflict(new { message = "รายการนี้ได้รับคืนไปแล้ว" });
        }

        record.ReturnedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        var dto = new BorrowingDto(record.Id, record.BookId, record.Book.Title, record.Book.Author,
            record.MemberId, record.Member.FullName, record.Member.MemberCode,
            record.BorrowedAt, record.DueDate, record.ReturnedAt,
            ResolveStatus(record.ReturnedAt, record.DueDate, record.ReturnedAt.Value));

        return Ok(dto);
    }

    private static string ResolveStatus(DateTime? returnedAt, DateTime dueDate, DateTime now)
    {
        if (returnedAt is not null)
        {
            return StatusReturned;
        }
        return dueDate < now ? StatusOverdue : StatusActive;
    }
}
