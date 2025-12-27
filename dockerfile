FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV ASPNETCORE_URLS=https://+:443;http://+:80

WORKDIR /app
EXPOSE 443
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

COPY ["QuickApp/QuickApp.csproj", "QuickApp/"]
COPY ["DAL/DAL.csproj", "DAL/"]
RUN dotnet restore "QuickApp/QuickApp.csproj"
COPY . .
WORKDIR "QuickApp"
RUN dotnet build "QuickApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "QuickApp.csproj" -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "QuickApp.dll"]