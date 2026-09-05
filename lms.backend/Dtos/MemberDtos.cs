namespace lms.backend.Dtos;

public record MemberDto(
    Guid Id,
    string MemberCode,
    string FullName,
    string Email,
    string? PhoneNumber,
    bool IsActive,
    DateTime JoinDate,
    int ActiveLoans);

public record MemberRequest(
    string FullName,
    string Email,
    string? PhoneNumber,
    bool IsActive);
