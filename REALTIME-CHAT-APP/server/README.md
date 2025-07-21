# Realtime Chat App - Backend

A real-time chat application backend built with Node.js, Express, Socket.IO, and MongoDB. This server provides REST API endpoints for user authentication, messaging, file uploads, and real-time communication capabilities.

## Features

- **User Authentication**: JWT-based authentication with signup/login
- **Real-time Messaging**: Socket.IO for instant message delivery
- **File Uploads**: Support for profile images and file sharing
- **Channel Support**: Create and manage chat channels
- **Message History**: Persistent message storage with MongoDB
- **CORS Enabled**: Cross-origin resource sharing for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv

## Project Structure

```text
server/
├── controllers/
│   ├── AuthController.js          # Authentication logic
│   ├── ChannelController.js       # Channel management
│   ├── ContactsController.js      # Contact management
│   └── MessagesControllers.js     # Message handling
├── middlewares/
│   └── AuthMiddleware.js           # JWT verification middleware
├── models/
│   ├── UserModel.js               # User schema
│   ├── MessagesModel.js           # Message schema
│   └── ChannelModel.js            # Channel schema
├── routes/
│   ├── AuthRoutes.js              # Authentication routes
│   ├── ContactRoutes.js           # Contact management routes
│   ├── MessagesRoutes.js          # Message routes
│   └── ChannelRoutes.js           # Channel routes
├── uploads/
│   ├── profiles/                  # Profile image uploads
│   └── files/                     # File message uploads
├── index.js                       # Main server file
├── socket.js                      # Socket.IO configuration
├── package.json
└── .env                          # Environment variables
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd REALTIME-CHAT-APP/server
   ```

2. **Install dependencies**

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the server directory:

   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/realtime-chat
   JWT_KEY=your-super-secret-jwt-key
   ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB**

   Make sure MongoDB is running on your system:

   ```bash
   # Windows (if installed as service)
   net start MongoDB

   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

## Scripts

```bash
# Development with auto-restart
pnpm dev

# Production start
pnpm start

# Run tests (if available)
pnpm test
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user-info` - Get user information (Protected)
- `POST /api/auth/update-profile` - Update user profile (Protected)
- `POST /api/auth/add-profile-image` - Upload profile image (Protected)
- `DELETE /api/auth/remove-profile-image` - Remove profile image (Protected)
- `POST /api/auth/logout` - User logout (Protected)

### Messages

- `POST /api/messages/get-messages` - Retrieve chat messages (Protected)
- `POST /api/messages/upload-file` - Upload file for messaging (Protected)

### Contacts

- Contact management endpoints (Protected)

### Channels

- Channel creation and management endpoints (Protected)

## Socket.IO Events

### Client to Server

- `sendMessage` - Send a direct message
- `sendChannelMessage` - Send a message to a channel
- `joinChannel` - Join a specific channel

### Server to Client

- `receiveMessage` - Receive a new message
- `receiveChannelMessage` - Receive a channel message

## Database Models

### User Model ([`UserModel.js`](models/UserModel.js))

```javascript
{
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  firstName: String,
  lastName: String,
  image: String,
  color: Number,
  profileSetup: Boolean (default: false)
}
```

### Message Model ([`MessagesModel.js`](models/MessagesModel.js))

```javascript
{
  sender: ObjectId (ref: User, required),
  recipient: ObjectId (ref: User),
  messageType: String (enum: ['text', 'file'], required),
  content: String (required for text messages),
  fileUrl: String (required for file messages),
  timestamp: Date (default: now)
}
```

### Channel Model ([`ChannelModel.js`](models/ChannelModel.js))

```javascript
{
  name: String (required),
  members: [ObjectId] (ref: User, required),
  admin: ObjectId (ref: User, required),
  message: [ObjectId] (ref: Message),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

## Authentication Flow

1. **Signup/Login**: User provides credentials via [`AuthController.signup`](controllers/AuthController.js) or [`AuthController.login`](controllers/AuthController.js)
2. **JWT Generation**: Server creates JWT token with user info using [`createToken`](controllers/AuthController.js)
3. **Cookie Storage**: JWT stored as httpOnly cookie with secure settings
4. **Protected Routes**: [`verifyToken`](middlewares/AuthMiddleware.js) middleware verifies JWT for protected endpoints
5. **Socket Authentication**: Socket connection authenticated via user ID

## File Upload

- **Profile Images**: Stored in `uploads/profiles/` directory via [`addProfileImage`](controllers/AuthController.js)
- **Message Files**: Stored in `uploads/files/` with timestamp-based folders via [`uploadFile`](controllers/MessagesControllers.js)
- **Supported**: All file types for messages, images for profiles
- **Security**: File validation and secure storage using [`multer`](routes/AuthRoutes.js)

## Error Handling

The API returns consistent error responses:

```javascript
{
  message: "Error description",
  // Additional error details if applicable
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Real-time Communication

Real-time features are handled in [`socket.js`](socket.js):

- **User Connection Management**: Track online users
- **Message Broadcasting**: Send messages via `sendMessage` event
- **Channel Communication**: Handle channel messages via `sendChannelMessage`
- **Message Persistence**: Store messages in MongoDB and broadcast to connected clients

## Development

### Adding New Routes

1. Create controller function in appropriate controller file
2. Add route in corresponding route file ([`AuthRoutes.js`](routes/AuthRoutes.js), [`MessagesRoutes.js`](routes/MessagesRoutes.js), etc.)
3. Apply [`verifyToken`](middlewares/AuthMiddleware.js) middleware if needed
4. Update this README with new endpoint

### Database Operations

All database operations use Mongoose ODM with async/await pattern:

```javascript
const user = await User.findById(userId);
const message = await Message.create(messageData);
```

### Socket.IO Integration

Real-time features are handled in [`socket.js`](socket.js):

- User connection management
- Message broadcasting using [`receiveMessage`](socket.js) events
- Channel communication using [`receiveChannelMessage`](socket.js) events

## Production Deployment

1. **Environment Variables**: Set production values in [`.env`](server/.env)
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Security**: Implement additional security headers
4. **Logging**: Add proper logging for production
5. **Process Management**: Use PM2 or similar for process management

## Security Features

- **Password Hashing**: bcrypt with salt rounds in [`UserModel.js`](models/UserModel.js)
- **JWT Authentication**: Secure token-based auth via [`AuthController.js`](controllers/AuthController.js)
- **CORS Configuration**: Restricted origins in [`index.js`](index.js)
- **Input Validation**: Server-side validation in controllers
- **File Upload Security**: Multer configuration with limits in routes

## Dependencies

### Production Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT implementation
- `bcrypt` - Password hashing
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing
- `cookie-parser` - Cookie parsing
- `dotenv` - Environment variable management

### Development Dependencies

- `nodemon` - Development server with auto-restart

## File Structure Details

- **Controllers**: Business logic for authentication ([`AuthController.js`](controllers/AuthController.js)), messages ([`MessagesControllers.js`](controllers/MessagesControllers.js)), and channels ([`ChannelController.js`](controllers/ChannelController.js))
- **Models**: Database schemas for users, messages, and channels
- **Routes**: API endpoint definitions with middleware
- **Middlewares**: JWT verification and other middleware functions
- **Socket**: Real-time communication setup and event handlers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Support

For issues and questions:

- Create an issue in the repository
- Check existing documentation
- Review error logs for debugging

---

**Note**: Make sure to keep your [`.env`](server/.env) file secure and never commit it to version control.
