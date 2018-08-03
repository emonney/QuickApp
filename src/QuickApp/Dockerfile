FROM microsoft/dotnet:2.1.2-aspnetcore-runtime AS base

# NODE
ENV NODE_VERSION 8.11.3
ENV NODE_DOWNLOAD_URL https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz
# https://nodejs.org/download/release/v8.11.3/SHASUMS256.txt
ENV NODE_DOWNLOAD_SHA 1ea408e9a467ed4571730e160993f67a100e8c347f6f9891c9a83350df2bf2be

RUN curl -SL "$NODE_DOWNLOAD_URL" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs
# END NODE

WORKDIR /app
EXPOSE 6780
EXPOSE 44367

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY src/QuickApp/QuickApp.csproj src/QuickApp/
COPY src/DAL/DAL.csproj src/DAL/
RUN dotnet restore src/QuickApp/QuickApp.csproj
COPY . .
WORKDIR /src/src/QuickApp
RUN dotnet build QuickApp.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish QuickApp.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "QuickApp.dll"]
