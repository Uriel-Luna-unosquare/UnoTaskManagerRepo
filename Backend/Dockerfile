# ---------- BUILD ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files 
COPY UnoTaskManager.API/UnoTaskManager.API.csproj UnoTaskManager.API/
COPY UnoTaskManager.Application/UnoTaskManager.Application.csproj UnoTaskManager.Application/
COPY UnoTaskManager.Infrastructure/UnoTaskManager.Infrastructure.csproj UnoTaskManager.Infrastructure/
COPY UnoTaskManager.Domain/UnoTaskManager.Domain.csproj UnoTaskManager.Domain/

RUN dotnet restore UnoTaskManager.API/UnoTaskManager.API.csproj

# Copy everything else
COPY . .

WORKDIR /src/UnoTaskManager.API
RUN dotnet publish -c Release -o /app/publish

# ---------- RUNTIME ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UnoTaskManager.API.dll"]