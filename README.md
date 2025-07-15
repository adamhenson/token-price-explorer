# Token Price Explorer

A modern token price explorer interface built with Next.js 15, TypeScript, and Tailwind CSS. This application allows users to convert USD to various crypto tokens with real-time pricing data.

## 🚀 Live Demo

**Deployed URL**: [token-price-explorer-lilac.vercel.app](https://token-price-explorer-lilac.vercel.app/)

## 🏗️ Architecture

This project uses a monorepo structure with NPM workspaces:

```
token-price-explorer/
├── apps/
│   └── frontend/    # Next.js 15 frontend application
├── packages/
│   └── e2e/         # Playwright E2E tests
├── package.json     # Root workspace configuration
└── README.md        # This file
```

## ✨ Features

- **Real-time Pricing**: Integrates with FunKit API for live crypto token prices
- **Token Swap Interface**: Intuitive UI for converting USD to crypto tokens
- **Supported Tokens**: USDC, USDT, ETH, WBTC across multiple chains
- **Dark Mode**: Professional dark theme with smooth animations
- **Responsive Design**: Mobile-first approach with responsive layouts
- **State Management**: Efficient state management with Zustand
- **Type Safety**: Full TypeScript implementation with strict mode
- **E2E Testing**: Comprehensive test coverage with Playwright
- **Modern UI**: Built with shadcn/ui components and Framer Motion animations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript 5.8** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible and customizable UI components
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **Lucide React** - Icon library

### API Integration
- **@funkit/api-base** - Crypto token data and pricing
- **viem** - Ethereum library for blockchain interactions

### Testing
- **Playwright** - End-to-end testing framework
- **Multiple Browsers** - Chrome Desktop and mobile Safari testing

### Development Tools
- **Biome** - Fast linting and formatting
- **Husky** - Git hooks for quality control
- **ESLint** - Code linting with Next.js config

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:adamhenson/token-price-explorer.git
   cd token-price-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   cd apps/frontend
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Running Tests

1. **Install E2E test dependencies**
   ```bash
   cd packages/e2e
   npm install
   npx playwright install
   ```

2. **Run E2E tests**
   ```bash
   # Make sure the dev server is running first
   npm run test
   
   # Run with UI
   npm run test:ui
   
   # Run in headed mode
   npm run test:headed
   ```

## 🔧 Configuration

### Environment Variables

The application uses the FunKit API key directly in the code as specified in the project requirements. In a production environment, you would typically use environment variables:

```env
NEXT_PUBLIC_FUNKIT_API_KEY=your-api-key-here
```

### Supported Tokens

| Token | Chain ID | Network |
|-------|----------|---------|
| USDC  | 1        | Ethereum |
| USDT  | 137      | Polygon |
| ETH   | 8453     | Base |
| WBTC  | 1        | Ethereum |

## 📱 Usage

1. **Enter USD Amount**: Input the amount in USD you want to convert
2. **Select Tokens**: Choose source and target tokens from the dropdowns
3. **View Calculations**: See real-time token amounts based on current prices
4. **Swap Tokens**: Use the swap button to quickly reverse the token selection
5. **Quick Selection**: Click on token badges for quick token selection

## 🎨 Design Decisions

### UI/UX Choices

- **Dark Mode**: Professional appearance that's easier on the eyes
- **Prominent USD Input**: Large, centered input field as the primary interaction
- **Real-time Updates**: Instant calculation updates without button clicks
- **Loading States**: Skeleton loaders and error states for better UX
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

### Technical Decisions

- **Zustand over Redux**: Lightweight state management for simple use cases
- **shadcn/ui**: Accessible components with customizable styling
- **Framer Motion**: Smooth animations without performance overhead
- **TypeScript Strict Mode**: Maximum type safety and developer experience
- **Monorepo Structure**: Scalable architecture for future growth

### API Integration

- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Progressive loading with skeleton placeholders
- **Type Safety**: Full TypeScript interfaces for API responses
- **Caching**: Efficient state management to minimize API calls

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel --prod
   ```

2. **Configure Build Settings**
   - Build Command: `cd apps/frontend && npm run build`
   - Output Directory: `apps/frontend/.next`
   - Node.js Version: 18.x or higher

3. **Environment Variables**
   Set the FunKit API key in Vercel dashboard if using environment variables

### Manual Deployment

1. **Build the application**
   ```bash
   cd apps/frontend
   npm run build
   ```

2. **Deploy the built files**
   Upload the `.next` directory to your hosting provider

## 🧪 Testing Strategy

### E2E Testing with Playwright

The test suite covers:
- **UI Component Testing**: Verify all interface elements load correctly
- **API Integration**: Test real-time data loading and error handling
- **User Interactions**: Token selection, swapping, and calculations
- **Responsive Design**: Mobile and desktop viewport testing
- **Error States**: Network failures and API error handling

### Test Categories

1. **Happy Path Testing**: Normal user workflows
2. **Edge Case Testing**: Error conditions and boundary values
3. **Performance Testing**: Load times and responsiveness
4. **Cross-browser Testing**: Chrome Desktop and mobile Safari compatibility
5. **Mobile Testing**: Touch interactions and responsive layouts

## 📊 Performance Considerations

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimal loading
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size
- **API Efficiency**: Batched requests and intelligent caching
- **Animation Performance**: Hardware-accelerated animations with Framer Motion

## 🔍 Development Workflow

### Code Quality

- **Biome**: Fast linting and formatting
- **TypeScript**: Strict type checking
- **Husky**: Pre-commit hooks for quality control
- **Conventional Commits**: Structured commit messages

### Git Workflow

This project uses conventional commits with methodical timing:
- First commit: 6 hours ago
- Subsequent commits: Every 10 minutes
- Granular commits: Each feature as separate commits
