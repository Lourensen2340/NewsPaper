using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NewsPaper.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            var connectionString = Environment.GetEnvironmentVariable("NEWS_PAPER_CONNECTION")
                                   ?? "Host=localhost;Database=newspaper;Username=postgres;Password=1234";

            // Убедитесь, что в проекте установлен Npgsql.EntityFrameworkCore.PostgreSQL 9.x
            builder.UseNpgsql(connectionString);

            return new ApplicationDbContext(builder.Options);
        }
    }
}