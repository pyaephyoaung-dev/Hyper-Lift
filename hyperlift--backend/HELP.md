# HyperLift Backend

## Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/html/)
* [Spring Web](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data.sql.jpa-and-spring-data)
* [Spring Security](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.security)
* [Validation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.validation)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Accessing data with MySQL](https://spring.io/guides/gs/accessing-data-mysql/)

## Project Structure

```
hyperlift-backend/
├── src/main/java/com/hyperlift/
│   ├── HyperLiftApplication.java
│   ├── controller/
│   ├── service/
│   ├── dao/
│   ├── entity/
│   ├── dto/
│   ├── security/
│   ├── exception/
│   ├── config/
│   └── util/
├── src/main/resources/
│   ├── application.properties
│   ├── static/
│   └── templates/
└── src/test/java/com/hyperlift/
    └── HyperLiftApplicationTests.java
```

## Running the Application

```bash
./mvnw spring-boot:run
```

## Building the Application

```bash
./mvnw clean package
```

## Database Configuration

The application uses MySQL. Make sure you have MySQL installed and running on port 3306.

Create the database:
```sql
CREATE DATABASE hyper_lift;
```

The application will automatically create/update tables using Hibernate's `ddl-auto=update` setting.
