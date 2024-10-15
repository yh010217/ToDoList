# 1. Gradle을 사용해 애플리케이션 빌드
FROM gradle:7.6.0-jdk17 AS build
WORKDIR /app

# 2. Gradle 캐시를 활용하기 위해 먼저 build.gradle과 설정 파일 복사
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle build --no-daemon || return 0

# 3. 소스 코드 복사 및 최종 빌드
COPY src ./src
RUN gradle bootJar --no-daemon

# 4. JDK 17 기반으로 빌드된 JAR 파일 실행
FROM openjdk:17-jdk-slim
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
