using lms.backend.Data;
using Microsoft.AspNetCore.Authorization;
using lms.backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class MembersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<MemberDto>>> GetMembers([FromQuery] string? search)
    {
        var query = db.Members.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(m =>
                EF.Functions.ILike(m.FullName, term) ||
                EF.Functions.ILike(m.Email, term) ||
                EF.Functions.ILike(m.MemberCode, term));
        }

        var members = await query
            .OrderBy(m => m.MemberCode)
            .Select(m => new MemberDto(
                m.Id,
                m.MemberCode,
                m.FullName,
                m.Email,
                m.PhoneNumber,
                m.IsActive,
                m.JoinDate,
                m.BorrowRecords.Count(r => r.ReturnedAt == null)))
            .ToListAsync();

        return Ok(members);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPost]
    public async Task<ActionResult<MemberDto>> CreateMember(MemberRequest request)
    {
        var email = request.Email.Trim();
        var emailTaken = await db.Members.AnyAsync(m => m.Email == email);
        if (emailTaken)
        {
            return Conflict(new { message = "อีเมลนี้ถูกใช้สมัครไปแล้ว" });
        }

        var member = new Entities.Member
        {
            Id = Guid.NewGuid(),
            MemberCode = await GenerateMemberCodeAsync(),
            FullName = request.FullName.Trim(),
            Email = email,
            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim(),
            IsActive = request.IsActive,
            JoinDate = DateTime.UtcNow
        };

        db.Members.Add(member);
        await db.SaveChangesAsync();

        var dto = new MemberDto(member.Id, member.MemberCode, member.FullName, member.Email,
            member.PhoneNumber, member.IsActive, member.JoinDate, 0);
        return CreatedAtAction(nameof(GetMembers), dto);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateMember(Guid id, MemberRequest request)
    {
        var member = await db.Members.FindAsync(id);
        if (member is null)
        {
            return NotFound(new { message = "ไม่พบสมาชิกที่ระบุ" });
        }

        var email = request.Email.Trim();
        var emailTaken = await db.Members.AnyAsync(m => m.Email == email && m.Id != id);
        if (emailTaken)
        {
            return Conflict(new { message = "อีเมลนี้ถูกใช้สมัครไปแล้ว" });
        }

        member.FullName = request.FullName.Trim();
        member.Email = email;
        member.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        member.IsActive = request.IsActive;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMember(Guid id)
    {
        var member = await db.Members.FindAsync(id);
        if (member is null)
        {
            return NotFound(new { message = "ไม่พบสมาชิกที่ระบุ" });
        }

        var hasActiveLoans = await db.BorrowRecords.AnyAsync(r => r.MemberId == id && r.ReturnedAt == null);
        if (hasActiveLoans)
        {
            return Conflict(new { message = "ไม่สามารถลบได้ เนื่องจากสมาชิกยังมีหนังสือที่ต้องคืนอยู่" });
        }

        db.Members.Remove(member);
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>สร้างรหัสสมาชิกถัดไปในรูปแบบ LIB-0001, LIB-0002, ...</summary>
    private async Task<string> GenerateMemberCodeAsync()
    {
        var lastCode = await db.Members
            .OrderByDescending(m => m.MemberCode)
            .Select(m => m.MemberCode)
            .FirstOrDefaultAsync();

        var next = 1;
        if (lastCode is not null && lastCode.StartsWith("LIB-") &&
            int.TryParse(lastCode["LIB-".Length..], out var parsed))
        {
            next = parsed + 1;
        }

        return $"LIB-{next:0000}";
    }
}
