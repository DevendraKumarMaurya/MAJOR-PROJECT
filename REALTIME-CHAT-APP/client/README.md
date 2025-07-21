# Realtime Chat App - Frontend

A modern, real-time chat application frontend built with React, TypeScript, and Vite. Features a responsive design with real-time messaging, file sharing, user authentication, and channel management.

## Features

- **Modern UI/UX**: Clean and responsive design with Tailwind CSS
- **Real-time Messaging**: Instant messaging with Socket.IO
- **User Authentication**: JWT-based login/signup with profile management
- **File Sharing**: Upload and share files in conversations
- **Channel Support**: Create and manage group chat channels
- **Profile Customization**: Avatar uploads and color themes
- **Direct Messages**: One-on-one conversations
- **Contact Management**: Search and add contacts
- **Message History**: Persistent chat history
- **File Downloads**: Download shared files with progress indicators
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI components with shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Routing**: React Router DOM
- **Notifications**: Sonner (toast notifications)
- **Animations**: Lottie React
- **Icons**: React Icons
- **Date Handling**: Moment.js

## Project Structure

```text
client/
├── public/
│   └── chat-icon.png              # App favicon
├── src/
│   ├── assets/                    # Static assets
│   │   ├── chat-logo.svg
│   │   ├── login2.png
│   │   ├── lottie-json.json
│   │   └── victory.svg
│   ├── components/
│   │   ├── ContactList.tsx        # Contact list component
│   │   └── ui/                    # Reusable UI components
│   ├── context/
│   │   ├── socketContext.ts       # Socket context types
│   │   └── SocketContext.tsx      # Socket.IO context provider
│   ├── hooks/
│   │   └── useSocket.ts           # Custom Socket.IO hook
│   ├── lib/
│   │   ├── api-clients.ts         # Axios API client configuration
│   │   ├── multipleSelectUtils.ts # Multi-select utilities
│   │   └── utils.ts               # Utility functions
│   ├── pages/
│   │   ├── auth/                  # Authentication pages
│   │   ├── chat/                  # Main chat interface
│   │   └── profile/               # User profile pages
│   ├── store/                     # Zustand store configuration
│   ├── utils/
│   │   └── constants.ts           # API endpoints and constants
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Global styles and Tailwind
│   ├── main.tsx                   # App entry point
│   └── vite-env.d.ts              # Vite environment types
├── components.json                # shadcn/ui configuration
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── .env                          # Environment variables
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd REALTIME-CHAT-APP/client
   ```

2. **Install dependencies**

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the client directory:

   ```env
   VITE_SERVER_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

## Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

## Key Components

### Authentication ([`auth/index.tsx`](src/pages/auth/index.tsx))

- **Login/Signup Forms**: Tabbed interface with validation
- **JWT Authentication**: Automatic token management
- **Redirect Logic**: Profile setup or chat based on user state

### Chat Interface ([`chat/index.tsx`](src/pages/chat/index.tsx))

- **Real-time Messaging**: Socket.IO integration
- **File Upload/Download**: Progress indicators and file management
- **Contact Management**: Search and add new contacts
- **Channel Support**: Group chat functionality

### Profile Management ([`profile/index.tsx`](src/pages/profile/index.tsx))

- **Profile Setup**: First-time user onboarding
- **Avatar Upload**: Profile image management
- **Color Themes**: Customizable user colors
- **Profile Updates**: Edit name and preferences

### Message Container

- **Message Rendering**: Support for text and file messages
- **File Downloads**: Automatic download with progress tracking
- **Message Types**: Direct messages and channel messages
- **Timestamp Display**: Formatted message times

## State Management

The app uses Zustand for state management with the following stores:

### Auth Store

```typescript
{
  userInfo: UserInfo | undefined,
  setUserInfo: (userInfo: UserInfo | undefined) => void
}
```

### Chat Store

```typescript
{
  selectedChatType: "contact" | "channel" | undefined,
  selectedChatData: Contact | Channel | undefined,
  directMessagesContacts: Contact[],
  channels: Channel[],
  messages: Message[],
  // ... other chat-related state
}
```

## API Integration

### HTTP Client ([`api-clients.ts`](src/lib/api-clients.ts))

- **Axios Configuration**: Base URL and interceptors
- **Cookie Support**: Automatic credential handling
- **Error Handling**: Centralized error management

### API Endpoints ([`constants.ts`](src/utils/constants.ts))

- **Authentication**: Login, signup, profile management
- **Messages**: Send, receive, file upload
- **Contacts**: Search, get contacts
- **Channels**: Create, manage channels

## Real-time Features

### Socket.IO Integration ([`SocketContext.tsx`](src/context/SocketContext.tsx))

- **Connection Management**: Automatic connect/disconnect
- **Message Events**: Real-time message delivery
- **Channel Events**: Group message broadcasting
- **File Upload Events**: Real-time file sharing

### Socket Events

- `sendMessage` - Send direct message
- `sendChannelMessage` - Send channel message
- `receiveMessage` - Receive direct message
- `receiveChannelMessage` - Receive channel message

## Styling

### Tailwind CSS ([`index.css`](src/index.css))

- **Custom Design System**: Extended Tailwind configuration
- **Dark/Light Mode**: CSS custom properties for theming
- **Poppins Font**: Multiple font weights imported
- **Component Styles**: Custom utility classes

### UI Components

- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives
- **Custom Styling**: Tailwind-based component styling

## File Handling

### File Upload

- **Profile Images**: Avatar upload with preview
- **Message Files**: File attachment in conversations
- **Progress Tracking**: Real-time upload progress
- **File Validation**: Type and size restrictions

### File Download

- **Automatic Downloads**: Click-to-download functionality
- **Progress Indicators**: Download progress tracking
- **File Icons**: Different icons for file types

## Routing

### Protected Routes

- **Authentication Check**: Redirect to login if not authenticated
- **Profile Setup**: Force profile completion for new users
- **Private Routes**: Chat and profile pages require authentication

### Route Structure

```typescript
- `/auth` - Login/Signup page
- `/profile` - User profile setup/edit
- `/chat` - Main chat interface (protected)
```

## Development

### Adding New Components

1. Create component in appropriate directory
2. Follow TypeScript interfaces from [`store/Interface.ts`](src/store/Interface.ts)
3. Use existing UI components from [`components/ui/`](src/components/ui/)
4. Apply consistent styling with Tailwind CSS

### State Updates

1. Use Zustand store for global state
2. Follow existing patterns in [`store/slices/`](src/store/slices/)
3. Update TypeScript interfaces as needed

### API Integration Overview

1. Add new endpoints to [`constants.ts`](src/utils/constants.ts)
2. Use existing [`apiClient`](src/lib/api-clients.ts) for HTTP requests
3. Handle errors with toast notifications

## Build and Deployment

### Production Build

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

### Environment Variables

```env
VITE_SERVER_URL=https://your-backend-api.com
```

### Deployment Considerations

- **Static Hosting**: Built files can be served from any static host
- **Environment Configuration**: Update API URLs for production
- **Asset Optimization**: Vite handles automatic optimization
- **Browser Support**: Modern browsers with ES2015+ support

## Performance Features

### Optimization

- **Vite Build**: Fast development and optimized production builds
- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Image and asset optimization
- **Tree Shaking**: Unused code elimination

### Real-time Optimization

- **Socket Connection**: Efficient connection management
- **Message Caching**: Local message storage
- **File Caching**: Prevent duplicate file uploads

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES2015+**: Modern JavaScript features
- **WebSocket Support**: Required for real-time features

## Dependencies

### Core Dependencies

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `typescript` - Type safety
- `axios` - HTTP client
- `socket.io-client` - Real-time communication
- `zustand` - State management

### UI Dependencies

- `@radix-ui/*` - Headless UI components
- `tailwindcss` - Utility-first CSS
- `react-icons` - Icon library
- `lottie-react` - Animation library
- `sonner` - Toast notifications

### Development Dependencies

- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting
- `@types/*` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Follow the existing code style
5. Test your changes
6. Submit a pull request

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**

   - Check if backend server is running
   - Verify `VITE_SERVER_URL` in `.env`

2. **Build Errors**

   - Clear node_modules and reinstall dependencies
   - Check TypeScript errors: `pnpm build`

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts

### Development Tips

- Use browser DevTools for debugging
- Monitor Network tab for API calls
- Check Console for Socket.IO connection status
- Use React DevTools for component debugging

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Support

For issues and questions:

- Create an issue in the repository
- Check browser console for errors
- Verify backend server connection

---

**Note**: Make sure the backend server is running on the URL specified in your `.env` file before starting the frontend development server.
