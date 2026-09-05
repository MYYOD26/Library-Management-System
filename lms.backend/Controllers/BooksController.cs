using lms.backend.Data;
using Microsoft.AspNetCore.Authorization;
using lms.backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BooksController(AppDbContext db) : ControllerBase
{
    private const string StatusAvailable = "available";
    private const string StatusBorrowed = "borrowed";

    [HttpGet]
    public async Task<ActionResult<BookListResponse>> GetBooks(
        [FromQuery] string? search,
        [FromQuery] Guid? categoryId,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(b =>
                EF.Functions.ILike(b.Title, term) ||
                EF.Functions.ILike(b.Author, term) ||
                (b.Isbn != null && EF.Functions.ILike(b.Isbn, term)));
        }

        if (categoryId.HasValue && categoryId.Value != Guid.Empty)
        {
            query = query.Where(b => b.CategoryId == categoryId.Value);
        }

        if (status == StatusAvailable)
        {
            query = query.Where(b => b.TotalCopies > b.BorrowRecords.Count(r => r.ReturnedAt == null));
        }
        else if (status == StatusBorrowed)
        {
            query = query.Where(b => b.TotalCopies <= b.BorrowRecords.Count(r => r.ReturnedAt == null));
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Author,
                b.Isbn,
                b.Publisher,
                b.PublishedYear,
                b.Description,
                b.CoverUrl,
                b.CategoryId,
                b.Category.Name,
                b.TotalCopies,
                b.TotalCopies - b.BorrowRecords.Count(r => r.ReturnedAt == null),
                b.TotalCopies - b.BorrowRecords.Count(r => r.ReturnedAt == null) > 0 ? StatusAvailable : StatusBorrowed,
                b.CreatedAt))
            .ToListAsync();

        return Ok(new BookListResponse(items, page, pageSize, totalCount, totalPages));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookDto>> GetBook(Guid id)
    {
        var book = await db.Books
            .Where(b => b.Id == id)
            .Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Author,
                b.Isbn,
                b.Publisher,
                b.PublishedYear,
                b.Description,
                b.CoverUrl,
                b.CategoryId,
                b.Category.Name,
                b.TotalCopies,
                b.TotalCopies - b.BorrowRecords.Count(r => r.ReturnedAt == null),
                b.TotalCopies - b.BorrowRecords.Count(r => r.ReturnedAt == null) > 0 ? StatusAvailable : StatusBorrowed,
                b.CreatedAt))
            .FirstOrDefaultAsync();

        return book is null ? NotFound(new { message = "ไม่พบหนังสือที่ระบุ" }) : Ok(book);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPost]
    public async Task<ActionResult<BookDto>> CreateBook(BookRequest request)
    {
        var categoryExists = await db.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "ไม่พบหมวดหมู่ที่ระบุ" });
        }

        if (!string.IsNullOrWhiteSpace(request.Isbn))
        {
            var isbnTaken = await db.Books.AnyAsync(b => b.Isbn == request.Isbn.Trim());
            if (isbnTaken)
            {
                return Conflict(new { message = "ISBN นี้มีอยู่ในระบบแล้ว" });
            }
        }

        var now = DateTime.UtcNow;
        var book = new Entities.Book
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Author = request.Author.Trim(),
            Isbn = string.IsNullOrWhiteSpace(request.Isbn) ? null : request.Isbn.Trim(),
            Publisher = string.IsNullOrWhiteSpace(request.Publisher) ? null : request.Publisher.Trim(),
            PublishedYear = request.PublishedYear,
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            CoverUrl = string.IsNullOrWhiteSpace(request.CoverUrl) ? null : request.CoverUrl.Trim(),
            CategoryId = request.CategoryId,
            TotalCopies = request.TotalCopies,
            CreatedAt = now,
            UpdatedAt = now
        };

        db.Books.Add(book);
        await db.SaveChangesAsync();

        var category = await db.Categories.FindAsync(book.CategoryId);
        var dto = new BookDto(
            book.Id, book.Title, book.Author, book.Isbn, book.Publisher, book.PublishedYear,
            book.Description, book.CoverUrl, book.CategoryId, category!.Name,
            book.TotalCopies, book.TotalCopies, StatusAvailable, book.CreatedAt);

        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, dto);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateBook(Guid id, BookRequest request)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound(new { message = "ไม่พบหนังสือที่ระบุ" });
        }

        var categoryExists = await db.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "ไม่พบหมวดหมู่ที่ระบุ" });
        }

        if (!string.IsNullOrWhiteSpace(request.Isbn))
        {
            var isbnTaken = await db.Books.AnyAsync(b => b.Isbn == request.Isbn.Trim() && b.Id != id);
            if (isbnTaken)
            {
                return Conflict(new { message = "ISBN นี้มีอยู่ในระบบแล้ว" });
            }
        }

        var borrowedCount = await db.BorrowRecords.CountAsync(r => r.BookId == id && r.ReturnedAt == null);
        if (request.TotalCopies < borrowedCount)
        {
            return Conflict(new { message = $"จำนวนเล่มรวมต้องไม่น้อยกว่าจำนวนที่ถูกยืมอยู่ ({borrowedCount} เล่ม)" });
        }

        book.Title = request.Title.Trim();
        book.Author = request.Author.Trim();
        book.Isbn = string.IsNullOrWhiteSpace(request.Isbn) ? null : request.Isbn.Trim();
        book.Publisher = string.IsNullOrWhiteSpace(request.Publisher) ? null : request.Publisher.Trim();
        book.PublishedYear = request.PublishedYear;
        book.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        book.CoverUrl = string.IsNullOrWhiteSpace(request.CoverUrl) ? null : request.CoverUrl.Trim();
        book.CategoryId = request.CategoryId;
        book.TotalCopies = request.TotalCopies;
        book.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteBook(Guid id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound(new { message = "ไม่พบหนังสือที่ระบุ" });
        }

        var hasActiveLoans = await db.BorrowRecords.AnyAsync(r => r.BookId == id && r.ReturnedAt == null);
        if (hasActiveLoans)
        {
            return Conflict(new { message = "ไม่สามารถลบได้ เนื่องจากยังมีรายการยืมที่ไม่ได้รับคืน" });
        }

        db.Books.Remove(book);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
