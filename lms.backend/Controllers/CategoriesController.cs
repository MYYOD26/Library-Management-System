using lms.backend.Data;
using Microsoft.AspNetCore.Authorization;
using lms.backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories()
    {
        var categories = await db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(
                c.Id,
                c.Name,
                c.Description,
                c.Books.Count))
            .ToListAsync();

        return Ok(categories);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CategoryRequest request)
    {
        var name = request.Name.Trim();
        var nameTaken = await db.Categories.AnyAsync(c => c.Name == name);
        if (nameTaken)
        {
            return Conflict(new { message = "มีหมวดหมู่ชื่อนี้อยู่ในระบบแล้ว" });
        }

        var category = new Entities.Category
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        db.Categories.Add(category);
        await db.SaveChangesAsync();

        var dto = new CategoryDto(category.Id, category.Name, category.Description, 0);
        return CreatedAtAction(nameof(GetCategories), dto);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCategory(Guid id, CategoryRequest request)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null)
        {
            return NotFound(new { message = "ไม่พบหมวดหมู่ที่ระบุ" });
        }

        var name = request.Name.Trim();
        var nameTaken = await db.Categories.AnyAsync(c => c.Name == name && c.Id != id);
        if (nameTaken)
        {
            return Conflict(new { message = "มีหมวดหมู่ชื่อนี้อยู่ในระบบแล้ว" });
        }

        category.Name = name;
        category.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null)
        {
            return NotFound(new { message = "ไม่พบหมวดหมู่ที่ระบุ" });
        }

        var hasBooks = await db.Books.AnyAsync(b => b.CategoryId == id);
        if (hasBooks)
        {
            return Conflict(new { message = "ไม่สามารถลบได้ เนื่องจากยังมีหนังสืออยู่ในหมวดหมู่นี้" });
        }

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
