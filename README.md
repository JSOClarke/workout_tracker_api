## Project Motivation
The goal of this project was to explore API development from end to end, including routing, validation, database design, and testing. I aimed to gain practical experience in building RESTful APIs and understanding how design decisions affect development and maintenance.


## Design Decisions

**Language Choice:**  
I chose JavaScript to rapidly prototype the API and experiment with design concepts without being slowed down by TypeScript’s strict type system. This allowed me to focus on architecture and functionality first, with the understanding that type safety could be added later.  

**Framework Choice:**  
Express was selected due to its simplicity, middleware support, and comprehensive documentation. It matched the project requirements and allowed me to implement features quickly while keeping the codebase maintainable.

## Schema Decisions
The database was designed from scratch using PostgreSQL, with DBDiagram employed to create an ERD for visual planning. This helped clarify relationships between entities and supported maintainable schema design.

<img width="1257" height="1102" alt="image" src="https://github.com/user-attachments/assets/17e0027a-9b8f-4e44-ac05-b2d3aece03f8" />


## Tradeoffs and Challenges
One significant tradeoff was using JavaScript instead of TypeScript. While it enabled faster prototyping, it also introduced runtime errors that would have been caught at compile-time in TypeScript.  

The most challenging part of the project was setting up the testing environment, including Jest, Supertest, and Babel for ESM transpilation. Once configured, testing significantly improved confidence in the codebase.

## Lessons Learned and Improvements for Next Time
- Adopt **Zod** for request validation to reduce manual checks and potential errors.  
- Implement **Test-Driven Development (TDD)** to define API contracts upfront, minimizing the need for later refactoring.  
- Plan tests and API contracts earlier to prevent errors like incorrect status codes or incomplete SQL query results from propagating to the controllers.  

## Testing Approach
This project used **post-development testing**, separating **unit tests** and **integration tests** for clarity and maintainability. The project structure supported this approach:

Project Structure:

- src/
  - app.js          : Express app
  - routes/         : API routes
  - controllers/    : Business logic
  - middleware/     : Auth, validation
  - services/       : SQL querying

## Limitations and Future Improvements
Current limitations include the absence of **rate limiting** and **CI/CD pipelines**. Future improvements would focus on:  
- Implementing TDD and Zod validation.  
- Adding CI/CD workflows for automated testing and deployment.  
- Enhancing API security and scalability.
