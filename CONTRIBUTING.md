# Contributing to Social Media Backend API

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, PostgreSQL version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/express-postgres-api.git
   cd express-postgres-api
   ```

2. **Create a branch**

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**

   - Follow the coding standards
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**

   ```bash
   npm install
   npm run dev
   # Test all affected endpoints
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**

   ```bash
   git push origin feat/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
feat: add user profile image upload
fix: correct post deletion authorization bug
docs: update API endpoints documentation
refactor: restructure authentication middleware
perf: optimize database queries for posts
test: add unit tests for comment controller
chore: update dependencies
```

## Coding Standards

### JavaScript Style Guide

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use async/await over callbacks
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### File Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Helper functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

### Naming Conventions

- **Files**: camelCase (e.g., `authController.js`)
- **Variables**: camelCase (e.g., `userId`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)
- **Classes**: PascalCase (e.g., `User`)
- **Functions**: camelCase (e.g., `getUserById`)

### Error Handling

Always use try-catch blocks and pass errors to the next middleware:

```javascript
const someFunction = async (req, res, next) => {
  try {
    // Your code here
  } catch (error) {
    next(error);
  }
};
```

### Validation

Always validate input data:

```javascript
const validation = [
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password too short"),
];
```

### Database Queries

- Use Sequelize ORM methods
- Include necessary associations
- Use transactions for multiple operations
- Handle errors properly

```javascript
const post = await Post.findByPk(id, {
  include: [
    {
      model: User,
      as: "author",
      attributes: ["id", "username"],
    },
  ],
});
```

## Testing

### Manual Testing

1. Start the server
2. Use Postman or cURL to test endpoints
3. Verify response format and status codes
4. Test error cases
5. Test authentication and authorization

### Test Checklist

- [ ] All endpoints return correct status codes
- [ ] Response format is consistent
- [ ] Error messages are clear
- [ ] Validation works properly
- [ ] Authentication works
- [ ] Authorization checks work
- [ ] Database operations succeed
- [ ] Edge cases handled

## Documentation

- Update README.md if needed
- Update API documentation (api-docs.yaml)
- Add JSDoc comments to functions
- Update CHANGELOG.md
- Include examples in docs

### JSDoc Example

```javascript
/**
 * Get all posts with pagination
 * @route   GET /api/posts
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {Object} - Posts array with pagination
 */
const getAllPosts = async (req, res, next) => {
  // Implementation
};
```

## Review Process

1. **Automated Checks**

   - Code style (if ESLint configured)
   - Tests (if available)

2. **Manual Review**

   - Code quality
   - Security considerations
   - Performance implications
   - Documentation updates

3. **Approval**
   - At least one maintainer approval required
   - All discussions resolved
   - CI/CD passing

## Areas for Contribution

### High Priority

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Implement search functionality
- [ ] Add post categories/tags
- [ ] Implement follow/unfollow users
- [ ] Add notifications system
- [ ] Implement file upload (images)

### Medium Priority

- [ ] Add Redis caching
- [ ] Implement rate limiting per user
- [ ] Add API versioning
- [ ] Implement soft deletes
- [ ] Add data export feature
- [ ] Improve error messages

### Nice to Have

- [ ] GraphQL API
- [ ] WebSocket support for real-time updates
- [ ] Admin dashboard
- [ ] Analytics endpoints
- [ ] Email notifications
- [ ] Social login (OAuth)

## Getting Help

- 💬 [Open a discussion](../../discussions)
- 🐛 [Report a bug](../../issues)
- 📧 Email: support@example.com (update this)
- 📖 Read the [documentation](./README.md)

## Recognition

Contributors will be recognized in:

- README.md Contributors section
- CHANGELOG.md for their contributions
- Special thanks in release notes

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🙏
