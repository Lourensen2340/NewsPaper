FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем project file
COPY ["NewsPaper.csproj", "."]
RUN dotnet restore "NewsPaper.csproj"

# Копируем всё и собираем
COPY . .
WORKDIR /src
RUN dotnet build "NewsPaper.csproj" -c Release -o /app/build
RUN dotnet publish "NewsPaper.csproj" -c Release -o /app/publish

# Финальный образ
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "NewsPaper.dll"]