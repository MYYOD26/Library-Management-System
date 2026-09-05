namespace lms.backend.Dtos;

public record BookDto(
    Guid Id,
    string Title,
    string Author,
    string? Isbn,
    string? Publisher,
    int? PublishedYear,
    string? Description,
    string? CoverUrl,
    Guid CategoryId,
    string CategoryName,
    int TotalCopies,
    int AvailableCopies,
    string Status,
    DateTime CreatedAt);

public record BookRequest(
    string Title,
    string Author,
    Guid CategoryId,
    string? Isbn,
    string? Publisher,
    int? PublishedYear,
    string? Description,
    string? CoverUrl,
    [property: System.ComponentModel.DataAnnotations.Range(0, 1000)] int TotalCopies);

public record BookListResponse(
    IReadOnlyList<BookDto> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
