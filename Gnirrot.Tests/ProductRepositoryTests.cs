using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Repositories;
using API.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Gnirrot.Tests
{
    [TestClass]
    public class ProductRepositoryTests
    {
        private DataContext _dbContext = default!;
        private Mock<IMapper> _mockMapper = default!;
        private ProductRepository _repository = default!;

        [TestInitialize]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                            .UseInMemoryDatabase(databaseName: "InMemoryProductDb")
                            .Options;

            _dbContext = new DataContext(options);
            _mockMapper = new Mock<IMapper>();
            _repository = new ProductRepository(_dbContext, _mockMapper.Object);

            // Mock configuration provider for mapper
            var configProvider = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Product, ProductDto>();
                cfg.CreateMap<Photo, PhotoDto>();
            });
            _mockMapper.Setup(m => m.ConfigurationProvider)
                .Returns(configProvider);
        }

        [TestCleanup]
        public void CleanUp()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [TestMethod]
        public async Task GetProductByNameAsync_ReturnsProduct()
        {
            // Arrange
            var product = new Product { Id = 1, Name = "ABCDEF" };
            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetProductByNameAsync("ABCDEF");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("ABCDEF", result.Name);
        }

        [TestMethod]
        public async Task GetProductByIdAsync_ReturnsProduct()
        {
            // Arrange
            var product = new Product { Id = 2, Name = "ABCDEF" };
            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetProductByIdAsync(2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Id);
        }

        [TestMethod]
        public async Task GetProductsAsync_ReturnsAllProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "ABCD" },
                new Product { Id = 2, Name = "EFGH" }
            };

            await _dbContext.Products.AddRangeAsync(products);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetProductsAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public async Task SaveAllAsync_ReturnsTrueOnSave()
        {
            // Arrange
            var product = new Product { Name = "ABCDEF" };
            _dbContext.Products.Add(product);

            // Act
            var saveResult = await _repository.SaveAllAsync();

            // Assert
            Assert.IsTrue(saveResult);
        }
    }
}
