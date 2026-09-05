using lms.backend.Data;
using Microsoft.AspNetCore.Authorization;
using lms.backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    private const string StatusAvailable = "available";
    private const string StatusBorrowed = "borrowed";

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var now = DateTime.UtcNow;
        var today = now.Date;

        var totalBooks = await db.Books.SumAsync(b => b.TotalCopies);
        var borrowedCopies = await db.BorrowRecords.CountAsync(r => r.ReturnedAt == null);

        var stats = new DashboardStatsDto(
            TotalBooks: totalBooks,
            ActiveLoans: borrowedCopies,
            DueToday: await db.BorrowRecords.CountAsync(r => r.ReturnedAt == null && r.DueDate.Date == today),
            TotalMembers: await db.Members.CountAsync(),
            OverdueCount: await db.BorrowRecords.CountAsync(r => r.ReturnedAt == null && r.DueDate < now),
            AvailableCopies: totalBooks - borrowedCopies);

        return Ok(stats);
    }

    [HttpGet("recent-books")]
    public async Task<ActionResult<IReadOnlyList<BookItemDto>>> GetRecentBooks([FromQuery] int limit = 6)
    {
        var recentBooks = await db.Books
            .OrderByDescending(b => b.CreatedAt)
            .Take(Math.Clamp(limit, 1, 20))
            .Select(b => new BookItemDto(
                b.Id,
                b.Title,
                b.Author,
                b.Category.Name,
                b.TotalCopies - b.BorrowRecords.Count(r => r.ReturnedAt == null) > 0
                    ? StatusAvailable
                    : StatusBorrowed))
            .ToListAsync();

        return Ok(recentBooks);
    }
}
