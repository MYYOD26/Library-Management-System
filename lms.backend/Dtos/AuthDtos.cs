namespace lms.backend.Dtos;

public record LoginRequest(string Username, string Password);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

/// <summary>ผู้ใช้ระบบ (แสดงผล) — ไม่มี password hash</summary>
public record UserDto(
    Guid Id,
    string Username,
    string Email,
    string FullName,
    string Role,
    bool IsActive,
    DateTime CreatedAt);

/// <summary>Response ตอน login สำเร็จ</summary>
public record AuthResponse(string Token, DateTime ExpiresAt, UserDto User);

public record CreateUserRequest(
    string Username,
    string Email,
    string FullName,
    string Password,
    string Role);

public record UpdateUserRequest(
    string Email,
    string FullName,
    string Role,
    bool IsActive);

public record ResetPasswordRequest(string NewPassword);
