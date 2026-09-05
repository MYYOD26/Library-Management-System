namespace lms.backend.Dtos;

public record CategoryDto(Guid Id, string Name, string? Description, int BookCount);

public record CategoryRequest(string Name, string? Description);
