using lms.backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace lms.backend.Data;

/// <summary>
/// ข้อมูลตัวอย่างสำหรับเริ่มต้นระบบ (จะ seed เฉพาะครั้งแรกเมื่อฐานข้อมูลยังว่าง)
/// </summary>
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        SeedUsers(db);

        if (db.Categories.Any() || db.Books.Any() || db.Members.Any())
        {
            return;
        }

        var now = DateTime.UtcNow;

        var categories = new[]
        {
            new Category { Id = Guid.NewGuid(), Name = "เทคโนโลยีและการเขียนโปรแกรม", Description = "หนังสือสายเทค โปรแกรมมิ่ง และวิศวกรรมซอฟต์แวร์", CreatedAt = now },
            new Category { Id = Guid.NewGuid(), Name = "นิยายและวรรณกรรม", Description = "นิยายร่วมสมัย วรรณกรรมคลาสสิก ทั้งไทยและต่างประเทศ", CreatedAt = now },
            new Category { Id = Guid.NewGuid(), Name = "ธุรกิจและการจัดการ", Description = "การบริหารจัดการ การตลาด และธุรกิจ", CreatedAt = now },
            new Category { Id = Guid.NewGuid(), Name = "วิทยาศาสตร์และคณิตศาสตร์", Description = "วิทยาศาสตร์ คณิตศาสตร์ และสิ่งแวดล้อม", CreatedAt = now },
            new Category { Id = Guid.NewGuid(), Name = "ภาษาและการสื่อสาร", Description = "การเรียนรู้ภาษาและทักษะการสื่อสาร", CreatedAt = now }
        };

        var books = new[]
        {
            new Book { Title = "Clean Code: A Handbook of Agile Software Craftsmanship", Author = "Robert C. Martin", Isbn = "9780132350884", Publisher = "Prentice Hall", PublishedYear = 2008, CategoryId = categories[0].Id, TotalCopies = 4, Description = "แนวปฏิบัติการเขียนโค้ดที่สะอาดและอ่านง่าย สำหรับนักพัฒนาซอฟต์แวร์" },
            new Book { Title = "The Pragmatic Programmer: Your Journey To Mastery", Author = "Andrew Hunt & David Thomas", Isbn = "9780135957059", Publisher = "Addison-Wesley", PublishedYear = 2019, CategoryId = categories[0].Id, TotalCopies = 3, Description = "คู่มือการทำงานของโปรแกรมเมอร์มืออาชีพ ตั้งแต่พื้นฐานจนถึงขั้นเซียน" },
            new Book { Title = "Introduction to Algorithms", Author = "Thomas H. Cormen et al.", Isbn = "9780262046305", Publisher = "MIT Press", PublishedYear = 2022, CategoryId = categories[3].Id, TotalCopies = 2, Description = "ตำราอัลกอริทึมฉบับมาตรฐาน (CLRS) ครอบคลุมทฤษฎีและการวิเคราะห์" },
            new Book { Title = "หลักการเขียนโปรแกรม Python เบื้องต้น", Author = "สมชาย ใจดี", Isbn = "9786161234567", Publisher = "สำนักพิมพ์ซอฟต์ทีค", PublishedYear = 2023, CategoryId = categories[0].Id, TotalCopies = 5, Description = "เรียนรู้การเขียนโปรแกรมภาษา Python ตั้งแต่เริ่มต้นจนนำไปใช้งานจริง" },
            new Book { Title = "Harry Potter and the Philosopher's Stone", Author = "J.K. Rowling", Isbn = "9780747532699", Publisher = "Bloomsbury", PublishedYear = 1997, CategoryId = categories[1].Id, TotalCopies = 6, Description = "เล่มแรกของเรื่องราวพ่อมดน้อยผู้โด่งดัง" },
            new Book { Title = "รอดตายจากการเป็นพนักงานออฟฟิศ", Author = "ปิยะพงษ์ สุขเกษม", Isbn = "9786169876543", Publisher = "สำนักพิมพ์วงการดี", PublishedYear = 2022, CategoryId = categories[2].Id, TotalCopies = 3, Description = "คู่มือเอาชีวิตรอดและเติบโตในโลกการทำงานออฟฟิศ" },
            new Book { Title = "Atomic Habits", Author = "James Clear", Isbn = "9780735211292", Publisher = "Avery", PublishedYear = 2018, CategoryId = categories[2].Id, TotalCopies = 4, Description = "การสร้างนิสัยดีในทุกวันเพื่อผลลัพธ์ระยะยาว" },
            new Book { Title = "A Brief History of Time", Author = "Stephen Hawking", Isbn = "9780553380163", Publisher = "Bantam", PublishedYear = 1988, CategoryId = categories[3].Id, TotalCopies = 2, Description = "เรื่องราวจักรวาลและเวลาที่เข้าใจง่ายสำหรับผู้อ่านทั่วไป" },
            new Book { Title = "English Grammar in Use", Author = "Raymond Murphy", Isbn = "9781108457651", Publisher = "Cambridge University Press", PublishedYear = 2019, CategoryId = categories[4].Id, TotalCopies = 8, Description = "หนังสือไวยากรณ์ภาษาอังกฤษยอดนิยมสำหรับผู้เรียนระดับกลาง" },
            new Book { Title = "รวมนิทานอีสปฉบับภาษาไทย", Author = "วรรณา แสงทอง", Publisher = "สำนักพิมพ์เยาวชน", PublishedYear = 2020, CategoryId = categories[1].Id, TotalCopies = 10, Description = "นิทานอีสปสอนคติสอนใจฉบับภาษาไทยสำหรับเด็กและครอบครัว" },
            new Book { Title = "Design Patterns: Elements of Reusable Object-Oriented Software", Author = "Erich Gamma et al.", Isbn = "9780201633610", Publisher = "Addison-Wesley", PublishedYear = 1994, CategoryId = categories[0].Id, TotalCopies = 2, Description = "ตำรารูปแบบการออกแบบซอฟต์แวร์เชิงวัตถุที่ถูกอ้างอิงมากที่สุด" },
            new Book { Title = "Sapiens: A Brief History of Humankind", Author = "Yuval Noah Harari", Isbn = "9780062316097", Publisher = "Harper", PublishedYear = 2014, CategoryId = categories[3].Id, TotalCopies = 3, Description = "ประวัติศาสตร์มนุษยชาติตั้งแต่ยุคหินจนถึงยุคเทคโนโลยี" }
        };

        var memberJoinDates = new[]
        {
            now.AddDays(-400), now.AddDays(-320), now.AddDays(-250), now.AddDays(-180),
            now.AddDays(-150), now.AddDays(-90), now.AddDays(-45), now.AddDays(-10)
        };
        var memberNames = new[]
        {
            ("สมชาย ใจดี", "somchai.j@example.com", "081-234-5678", true),
            ("สุนิสา แก้วมณี", "sunsia.k@example.com", "082-345-6789", true),
            ("ปิยะพงษ์ สุขเกษม", "piyapong.s@example.com", "083-456-7890", true),
            ("มาลี รุ่งเรือง", "malee.r@example.com", "084-567-8901", true),
            ("ธนกร วงศ์ทอง", "thanakorn.w@example.com", "085-678-9012", true),
            ("อริสรา พงษ์ไพร", "arisara.p@example.com", "086-789-0123", true),
            ("กิตติศักดิ์ จันทร์เพ็ญ", "kittisak.c@example.com", "087-890-1234", false),
            ("ณัฐริกา บุญมี", "nattarika.b@example.com", "088-901-2345", true)
        };

        var members = memberNames.Select((m, i) => new Member
        {
            Id = Guid.NewGuid(),
            MemberCode = $"LIB-{i + 1:0000}",
            FullName = m.Item1,
            Email = m.Item2,
            PhoneNumber = m.Item3,
            IsActive = m.Item4,
            JoinDate = memberJoinDates[i]
        }).ToList();

        db.Categories.AddRange(categories);
        db.Books.AddRange(books);
        db.Members.AddRange(members);
        db.SaveChanges();

        // รายการยืมตัวอย่าง: ทั้งกำลังยืม (มีเกินกำหนด), คืนแล้ว และกำลังจะครบกำหนดวันนี้
        var borrowRecords = new[]
        {
            new BorrowRecord
            {
                BookId = books[4].Id, MemberId = members[0].Id,
                BorrowedAt = now.AddDays(-20), DueDate = now.AddDays(-6) // เกินกำหนดคืน
            },
            new BorrowRecord
            {
                BookId = books[0].Id, MemberId = members[1].Id,
                BorrowedAt = now.AddDays(-10), DueDate = now.AddDays(4) // กำลังยืมอยู่
            },
            new BorrowRecord
            {
                BookId = books[6].Id, MemberId = members[2].Id,
                BorrowedAt = now.AddDays(-14), DueDate = now // ครบกำหนดวันนี้
            },
            new BorrowRecord
            {
                BookId = books[8].Id, MemberId = members[3].Id,
                BorrowedAt = now.AddDays(-40), DueDate = now.AddDays(-26), ReturnedAt = now.AddDays(-25)
            },
            new BorrowRecord
            {
                BookId = books[10].Id, MemberId = members[0].Id,
                BorrowedAt = now.AddDays(-60), DueDate = now.AddDays(-46), ReturnedAt = now.AddDays(-48)
            },
            new BorrowRecord
            {
                BookId = books[7].Id, MemberId = members[4].Id,
                BorrowedAt = now.AddDays(-3), DueDate = now.AddDays(11) // กำลังยืมอยู่
            }
        };

        db.BorrowRecords.AddRange(borrowRecords);
        db.SaveChanges();
    }

    /// <summary>
    /// บัญชีผู้ใช้เริ่มต้น (seed เมื่อยังไม่มีผู้ใช้ในระบบ)
    /// admin / Admin123! , librarian / Librarian123! , member / Member123!
    /// </summary>
    private static void SeedUsers(AppDbContext db)
    {
        if (db.Users.Any())
        {
            return;
        }

        var hasher = new PasswordHasher<AppUser>();
        var now = DateTime.UtcNow;

        var users = new List<AppUser>
        {
            new()
            {
                Id = Guid.NewGuid(), Username = "admin", Email = "admin@lms.local",
                FullName = "ผู้ดูแลระบบ", Role = AppRoles.Admin, IsActive = true, CreatedAt = now
            },
            new()
            {
                Id = Guid.NewGuid(), Username = "librarian", Email = "librarian@lms.local",
                FullName = "สมศรี บรรณารักษ์", Role = AppRoles.Librarian, IsActive = true, CreatedAt = now
            },
            new()
            {
                Id = Guid.NewGuid(), Username = "member", Email = "member@lms.local",
                FullName = "สมหมาย สมาชิก", Role = AppRoles.Member, IsActive = true, CreatedAt = now
            }
        };

        foreach (var user in users)
        {
            user.PasswordHash = user.Username switch
            {
                "admin" => hasher.HashPassword(user, "Admin123!"),
                "librarian" => hasher.HashPassword(user, "Librarian123!"),
                _ => hasher.HashPassword(user, "Member123!")
            };
        }

        db.Users.AddRange(users);
        db.SaveChanges();
    }
}
