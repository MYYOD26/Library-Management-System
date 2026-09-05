using lms.backend.Data;
using lms.backend.Dtos;
using lms.backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Controllers;

/// <summary>จัดการผู้ใช้ระบบ (เข้าถึงได้เฉพาะ Admin)</summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController(AppDbContext db, IPasswordHasher<AppUser> passwordHasher) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers([FromQuery] string? search)
    {
        var query = db.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(u =>
                EF.Functions.ILike(u.Username, term) ||
                EF.Functions.ILike(u.FullName, term) ||
                EF.Functions.ILike(u.Email, term));
        }

        var users = await query
            .OrderBy(u => u.Username)
            .Select(u => ToDto(u))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserRequest request)
    {
        var error = await ValidateAsync(username: request.Username.Trim().ToLowerInvariant(), email: request.Email.Trim(), ignoreUserId: null);
        if (error is not null)
        {
            return error;
        }

        if (!AppRoles.All.Contains(request.Role))
        {
            return BadRequest(new { message = "Role ไม่ถูกต้อง" });
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = request.Username.Trim().ToLowerInvariant(),
            Email = request.Email.Trim(),
            FullName = request.FullName.Trim(),
            Role = request.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsers), ToDto(user));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest request)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound(new { message = "ไม่พบผู้ใช้ที่ระบุ" });
        }

        if (!AppRoles.All.Contains(request.Role))
        {
            return BadRequest(new { message = "Role ไม่ถูกต้อง" });
        }

        // กันตัวเองล็อคตัวเอง: ห้ามลดสถานะหรือเปลี่ยน role ของบัญชีตัวเองให้ใช้งานไม่ได้
        if (user.Id == CurrentUserId && (!request.IsActive || request.Role != user.Role))
        {
            return Conflict(new { message = "ไม่สามารถปิดการใช้งานหรือเปลี่ยน Role ของบัญชีตัวเองได้" });
        }

        var error = await ValidateAsync(username: null, email: request.Email.Trim(), ignoreUserId: id);
        if (error is not null)
        {
            return error;
        }

        user.Email = request.Email.Trim();
        user.FullName = request.FullName.Trim();
        user.Role = request.Role;
        user.IsActive = request.IsActive;

        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>รีเซ็ตรหัสผ่านให้ผู้ใช้คนอื่น (ไม่ต้องรู้รหัสเดิม)</summary>
    [HttpPost("{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, ResetPasswordRequest request)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound(new { message = "ไม่พบผู้ใช้ที่ระบุ" });
        }

        user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        if (id == CurrentUserId)
        {
            return Conflict(new { message = "ไม่สามารถลบบัญชีของตัวเองได้" });
        }

        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound(new { message = "ไม่พบผู้ใช้ที่ระบุ" });
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Guid CurrentUserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    /// <summary>ตรวจ email/username ซ้ำ คืน ActionResult error หรือ null ถ้าผ่าน</summary>
    private async Task<ActionResult?> ValidateAsync(string? username, string email, Guid? ignoreUserId)
    {
        if (username is not null)
        {
            var usernameTaken = await db.Users.AnyAsync(u => u.Username == username);
            if (usernameTaken)
            {
                return Conflict(new { message = "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
            }
        }

        var emailTaken = ignoreUserId.HasValue
            ? await db.Users.AnyAsync(u => u.Email == email && u.Id != ignoreUserId.Value)
            : await db.Users.AnyAsync(u => u.Email == email);
        if (emailTaken)
        {
            return Conflict(new { message = "อีเมลนี้ถูกใช้แล้ว" });
        }

        return null;
    }

    private static UserDto ToDto(AppUser user) =>
        new(user.Id, user.Username, user.Email, user.FullName, user.Role, user.IsActive, user.CreatedAt);
}
