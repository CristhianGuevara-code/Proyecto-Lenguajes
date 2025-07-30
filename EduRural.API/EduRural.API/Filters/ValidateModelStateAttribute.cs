using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Filters
{
    public class ValidateModelStateAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ModelState.IsValid == false)
            {
                var errors = context.ModelState.Where(x => x.Value.Errors.Count > 0).ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value.Errors
                        .Select(x => x.ErrorMessage)
                        .ToList()
                    );

                var responseObj = new ResponseDto<Dictionary<string, List<string>>>
                {
                    StatusCode = 400,
                    Status = false,
                    Message = "Se encontraron errores al validar la informacion",
                    Data = errors
                };

                context.Result = new JsonResult(responseObj)
                {
                    StatusCode = 400,

                };
            }
        }
    }
}

