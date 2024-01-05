using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;
public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Material, MaterialDto>();
        CreateMap<MaterialDto, Material>();
        CreateMap<AppUser, MemberDto>();
        CreateMap<Product, ProductDto>()
            .ForMember(product => product.PhotoUrl,
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dto => dto.Materials, opt => opt.MapFrom(src => src.Materials))
            .ForMember(product => product.CategoryName,
                opt => opt.MapFrom(src => src.Category.Name));
        CreateMap<Photo, PhotoDto>();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<ProductDto, Product>()

            .ForMember(dest => dest.Photos, opt => opt.Ignore()) // Assuming you handle Photos separately
            .ForMember(dest => dest.Materials, opt => opt.MapFrom(src => src.Materials))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
            .ForMember(dest => dest.Employee, opt => opt.MapFrom(src => src.Employee == null ? null : new AppUser {
                Id = src.Employee.Id,
                ShortName = src.Employee.ShortName,
                FirstName = src.Employee.FirstName,
                LastName = src.Employee.LastName,
                DateOfBirth = src.Employee.DateOfBirth,
                Joined = src.Employee.Joined,
                Workplace = src.Employee.Workplace,
                PhotoUrl = src.Employee.PhotoUrl,
                Role = src.Employee.Role,
                // Do not map PasswordHash and PasswordSalt
            }))            // Map other properties as needed
            .AfterMap((dto, product) => {
                // Handle Photos if needed
                if (dto.Photos != null)
                {
                    product.Photos = new List<Photo>();
                    foreach (var photoDto in dto.Photos)
                    {
                        var photo = new Photo
                        {
                            Id = photoDto.Id,
                            Url = photoDto.Url,
                            IsMain = photoDto.IsMain,
                            ProductId = product.Id
                        };
                        product.Photos.Add(photo);
                    }
                }

                // Handle Materials
                if (dto.Materials != null)
                {
                    product.Materials = new List<Material>();
                    foreach (var materialDto in dto.Materials)
                    {
                        var material = new Material
                        {
                            Id = materialDto.Id,
                            Name = materialDto.Name,
                            Price = materialDto.Price,
                            AmountInStock = int.Parse(materialDto.AmountInStock), // Assuming this conversion is safe
                            MaterialType = materialDto.MaterialType,
                            Width = materialDto.Width,
                            Height = materialDto.Height,
                            Length = materialDto.Length
                        };
                        product.Materials.Add(material);
                    }
                }
            });
    }
}