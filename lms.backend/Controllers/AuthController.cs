using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using lms.backend.Data;
using lms.backend.Dtos;
using lms.backend.Entities;
using lms.backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuthController(
    AppDbContext db,
    TokenService tokenService,
    IPasswordHasher<AppUser> passwordHasher) : ControllerBase
{
    /// <summary>เข้าสู่ระบบด้วย username + password ได้รับ JWT กลับไป</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var username = request.Username.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user is null || !user.IsActive)
        {
            return Unauthorized(new { message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        // อัปเกรด hash อัตโนมัติหาก algorithm เก่า (rehash needed)
        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
            await db.SaveChangesAsync();
        }

        var (token, expiresAt) = tokenService.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAt, ToDto(user)));
    }

    /// <summary>ข้อมูลผู้ใช้ปัจจุบันจาก JWT</summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var user = await FindCurrentUserAsync();
        return user is null ? Unauthorized(new { message = "ไม่พบผู้ใช้ในระบบ" }) : Ok(ToDto(user));
    }

    /// <summary>เปลี่ยนรหัสผ่านของตัวเอง</summary>
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var user = await FindCurrentUserAsync();
        if (user is null)
        {
            return Unauthorized(new { message = "ไม่พบผู้ใช้ในระบบ" });
        }

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
        if (result == PasswordVerificationResult.Failed)
        {
            return BadRequest(new { message = "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
        }

        user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<AppUser?> FindCurrentUserAsync()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(sub, out var userId) ? await db.Users.FindAsync(userId) : null;
    }

    private static UserDto ToDto(AppUser user) =>
        new(user.Id, user.Username, user.Email, user.FullName, user.Role, user.IsActive, user.CreatedAt);
}
