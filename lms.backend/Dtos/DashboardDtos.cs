namespace lms.backend.Dtos;

public record BookItemDto(
    Guid Id,
    string Title,
    string Author,
    string Category,
    string Status);

public record DashboardStatsDto(
    int TotalBooks,
    int ActiveLoans,
    int DueToday,
    int TotalMembers,
    int OverdueCount,
    int AvailableCopies);
