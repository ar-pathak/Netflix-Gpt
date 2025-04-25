# Netflix GPT

An AI-powered movie recommendation and streaming platform.

## Features

- AI-powered movie recommendations
- Real-time movie search
- Personalized watchlists
- Movie details and trailers
- User authentication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for OMDB and TMDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/netflix-gpt.git
cd netflix-gpt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys and configuration values

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OMDB API Configuration
VITE_OMDB_API_KEY=your_omdb_api_key

# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
