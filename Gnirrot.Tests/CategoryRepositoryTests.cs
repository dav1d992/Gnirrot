using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Repositories;
using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Gnirrot.Tests
{
    [TestClass]
    public class CategoryRepositoryTests
    {
        private DataContext _dbContext = default!;
        private Mock<IMapper> _mockMapper = default!;
        private CategoryRepository _repository = default!;

        [TestInitialize]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                            .UseInMemoryDatabase(databaseName: "InMemoryDb")
                            .Options;

            _dbContext = new DataContext(options);
            _mockMapper = new Mock<IMapper>();
            _repository = new CategoryRepository(_dbContext, _mockMapper.Object);
        }

        [TestCleanup]
        public void CleanUp()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [TestMethod]
        public async Task GetCategoriesAsync_ReturnsAllCategories()
        {
            // Arrange
            var categories = new List<Category>
    {
        new Category { Id = 1, Name = "ABC" },
        new Category { Id = 2, Name = "DEF" }
    };

            await _dbContext.Categories.AddRangeAsync(categories);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetCategoriesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
        }


        [TestMethod]
        public async Task AddNewCategory()
        {
            // Arrange
            var newCategory = new Category { Name = "Sofas" };

            // Act
            await _dbContext.Categories.AddAsync(newCategory);
            await _dbContext.SaveChangesAsync();

            // Assert
            var categoryExists = await _dbContext.Categories.AnyAsync(c => c.Name == "Sofas");
            Assert.IsTrue(categoryExists);
        }

        [TestMethod]
        public async Task DeleteCategory_WhenCategoryExists()
        {
            // Arrange
            var category = new Category { Name = "Office" };
            await _dbContext.Categories.AddAsync(category);
            await _dbContext.SaveChangesAsync();

            // Act
            var categoryToDelete = await _dbContext.Categories.FindAsync(category.Id);
            _dbContext.Categories.Remove(categoryToDelete!);
            await _dbContext.SaveChangesAsync();

            // Assert
            var categoryExists = await _dbContext.Categories.AnyAsync(c => c.Id == category.Id);
            Assert.IsFalse(categoryExists);
        }
    }
}
