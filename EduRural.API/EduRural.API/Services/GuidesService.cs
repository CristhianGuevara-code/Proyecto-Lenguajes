using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Guides;
using EduRural.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;
//using System.Net;

namespace EduRural.API.Services
{
    public class GuidesService : IGuidesService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;

        public GuidesService(EduRuralDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ResponseDto<List<GuideDto>>> GetListAsync()
        {
            var guides = await _context.Guides
                .Include(g => g.Grade)
                .Include(g => g.UploadedBy)
                .ToListAsync();

            return new ResponseDto<List<GuideDto>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registros obtenidos correctamente",
                Data = _mapper.Map<List<GuideDto>>(guides)
            };
        }

        public async Task<ResponseDto<GuideDto>> GetOneByIdAsync(string id)
        {
            var guide = await _context.Guides
                .Include(g => g.Grade)
                .Include(g => g.UploadedBy)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (guide is null)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada"
                };
            }

            return new ResponseDto<GuideDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Guía encontrada",
                Data = _mapper.Map<GuideDto>(guide)
            };
        }

        public async Task<ResponseDto<GuideDto>> CreateAsync(GuideCreateDto dto, string userId)
        {

            var exists = await _context.Grades.AnyAsync(g => g.Id == dto.GradeId);
            if (!exists)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "El grado no existe"
                };
            }

            var guide = _mapper.Map<GuideEntity>(dto);
            guide.Id = Guid.NewGuid().ToString();
            guide.GradeId = dto.GradeId;
            guide.UploadedById = userId;
            guide.UploadDate = DateTime.UtcNow;

            _context.Guides.Add(guide);
            await _context.SaveChangesAsync();

            return new ResponseDto<GuideDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Guía creada correctamente",
                Data = _mapper.Map<GuideDto>(guide)
            };
        }

        public async Task<ResponseDto<GuideDto>> EditAsync(GuideEditDto dto, string id)
        {
            var guide = await _context.Guides.FindAsync(id);

            if (guide is null)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada"
                };
            }

            _mapper.Map(dto, guide);

            _context.Guides.Update(guide);
            await _context.SaveChangesAsync();

            return new ResponseDto<GuideDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Guía actualizada correctamente",
                Data = _mapper.Map<GuideDto>(guide)
            };
        }

        public async Task<ResponseDto<GuideDto>> DeleteAsync(string id)
        {
            var guide = await _context.Guides.FindAsync(id);

            if (guide is null)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada"
                };
            }

            _context.Guides.Remove(guide);
            await _context.SaveChangesAsync();

            return new ResponseDto<GuideDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Guía eliminada correctamente",
                Data = _mapper.Map<GuideDto>(guide)
            };
        }
    }
}
