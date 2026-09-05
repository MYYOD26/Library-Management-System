using lms.backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace lms.backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Book> Books => Set<Book>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<BorrowRecord> BorrowRecords => Set<BorrowRecord>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(c => c.Name).HasMaxLength(120).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(500);
            entity.HasIndex(c => c.Name).IsUnique();
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.Property(b => b.Title).HasMaxLength(250).IsRequired();
            entity.Property(b => b.Author).HasMaxLength(200).IsRequired();
            entity.Property(b => b.Isbn).HasMaxLength(20);
            entity.Property(b => b.Publisher).HasMaxLength(150);
            entity.Property(b => b.CoverUrl).HasMaxLength(500);
            entity.Property(b => b.Description).HasMaxLength(2000);
            // ISBN ซ้ำกันไม่ได้ แต่กรณีไม่ได้กรอก (NULL) อนุญาตให้มีได้หลายรายการ
            entity.HasIndex(b => b.Isbn).IsUnique().HasFilter("\"Isbn\" IS NOT NULL");
            entity.HasOne(b => b.Category)
                  .WithMany(c => c.Books)
                  .HasForeignKey(b => b.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.Property(m => m.MemberCode).HasMaxLength(20).IsRequired();
            entity.Property(m => m.FullName).HasMaxLength(150).IsRequired();
            entity.Property(m => m.Email).HasMaxLength(200).IsRequired();
            entity.Property(m => m.PhoneNumber).HasMaxLength(20);
            entity.HasIndex(m => m.MemberCode).IsUnique();
            entity.HasIndex(m => m.Email).IsUnique();
        });

        modelBuilder.Entity<BorrowRecord>(entity =>
        {
            entity.HasOne(r => r.Book)
                  .WithMany(b => b.BorrowRecords)
                  .HasForeignKey(r => r.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(r => r.Member)
                  .WithMany(m => m.BorrowRecords)
                  .HasForeignKey(r => r.MemberId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(r => new { r.BookId, r.ReturnedAt });
            entity.HasIndex(r => new { r.MemberId, r.ReturnedAt });
        });

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.Property(u => u.Username).HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(200).IsRequired();
            entity.Property(u => u.FullName).HasMaxLength(150).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(20).IsRequired();
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });
    }
}
