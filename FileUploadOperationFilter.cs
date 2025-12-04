using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasFormFile = context.MethodInfo.GetParameters()
            .Any(p => p.ParameterType == typeof(IFormFile));

        if (!hasFormFile) return;

        // Очищаем существующие параметры
        operation.Parameters?.Clear();

        operation.RequestBody = new OpenApiRequestBody
        {
            Description = "Upload image file",
            Content =
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Required = new HashSet<string> { "file" },
                        Properties =
                        {
                            ["file"] = new OpenApiSchema
                            {
                                Type = "string",
                                Format = "binary",
                                Description = "Select image file (JPEG, PNG, GIF, WebP, BMP). Max 5MB."
                            }
                        }
                    }
                }
            }
        };

        // Настраиваем ответы
        operation.Responses["200"] = new OpenApiResponse
        {
            Description = "✅ File uploaded successfully",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties =
                        {
                            ["success"] = new OpenApiSchema { Type = "boolean", Example = new Microsoft.OpenApi.Any.OpenApiBoolean(true) },
                            ["fileUrl"] = new OpenApiSchema { Type = "string", Example = new Microsoft.OpenApi.Any.OpenApiString("/images/guid.jpg") },
                            ["message"] = new OpenApiSchema { Type = "string", Example = new Microsoft.OpenApi.Any.OpenApiString("File uploaded successfully") }
                        }
                    }
                }
            }
        };

        operation.Responses["400"] = new OpenApiResponse
        {
            Description = "❌ Bad Request - Invalid file or validation failed",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties =
                        {
                            ["error"] = new OpenApiSchema { Type = "string", Example = new Microsoft.OpenApi.Any.OpenApiString("Invalid file type") }
                        }
                    }
                }
            }
        };

        operation.Responses["401"] = new OpenApiResponse
        {
            Description = "🔒 Unauthorized - Admin authentication required"
        };

        operation.Responses["415"] = new OpenApiResponse
        {
            Description = "❌ Unsupported Media Type - Must be multipart/form-data"
        };
    }
}