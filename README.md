# Electronic Shop - Frontend

Frontend application for the Electronic Shop e-commerce platform.

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Zustand (State Management)
- Socket.IO Client

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Production Backend URL
NEXT_PUBLIC_API_URL=https://electronic-shop-server-f1vf.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://electronic-shop-server-f1vf.vercel.app

# For local development, use:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Mapbox (for maps)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
client/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   ├── providers/     # Context providers
│   ├── services/      # API services
│   ├── store/         # Zustand stores
│   └── types/         # TypeScript types
├── public/            # Static assets
└── package.json
```

## Features

- Server-side rendering with Next.js
- Responsive design with Tailwind CSS
- Real-time chat with Socket.IO
- Multi-language support (Arabic & English)
- Shopping cart and wishlist
- Product search and filtering
- User authentication
- Admin dashboard
- Order management
- Invoice generation

## License

ISC
