export const LOGO_URL =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const USER_AVATAR =
  "https://occ-0-6247-2164.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png?r=e6e";

export const API_ENDPOINTS = {
  TMDB: {
    BASE_URL: "https://api.themoviedb.org/3",
    NOW_PLAYING: "/movie/now_playing",
    POPULAR: "/movie/popular",
    TOP_RATED: "/movie/top_rated",
    UPCOMING: "/movie/upcoming",
    MOVIE_DETAILS: "/movie",
    SEARCH: "/search/movie",
  },
  OMDB: {
    BASE_URL: "https://www.omdbapi.com",
    API_KEY: import.meta.env.VITE_OMDB_API_KEY,
    SEARCH: "/?s=",
    DETAILS: "/?i=",
  },
  OPENAI: {
    BASE_URL: "https://api.openai.com/v1",
    CHAT_COMPLETION: "/chat/completions",
  },
};

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
};

export const IMG_CDN = {
  TMDB: {
    ORIGINAL: "https://image.tmdb.org/t/p/original",
    W500: "https://image.tmdb.org/t/p/w500",
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/signup",
  BROWSE: "/browse",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  HELP: "/help",
  SEARCH: "/search"
};

export const SUPPORTED_LANGUAGES = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
};

export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
};

export const FIREBASE_ERROR_CODES = {
  "auth/email-already-in-use": "This email is already registered",
  "auth/invalid-email": "Invalid email address",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/weak-password": "Password is too weak",
  "auth/user-disabled": "This account has been disabled",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Incorrect password",
  "auth/too-many-requests": "Too many attempts. Please try again later",
  "auth/network-request-failed": "Network error. Please check your connection",
};

// App specific constants
export const APP_CONFIG = {
  NAME: "Netflix GPT",
  DESCRIPTION: "Your AI-powered movie companion",
  API_ENDPOINTS: API_ENDPOINTS,
  VERSION: "1.0.0",
  FOOTER_TEXT: "© 2024 Netflix GPT. All rights reserved.",
  CONTACT_EMAIL: "support@netflixgpt.com",
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_MISMATCH: "Passwords do not match",
  WEAK_PASSWORD: "Password does not meet the requirements",
  INVALID_NAME: "Please enter a valid name",
};

// API request configurations
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 3600, // 1 hour in seconds
};

export const IMAGES = {
  LOGO: "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png",
  USER_AVATAR:
    "https://occ-0-6247-2164.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png?r=e6e",
  AUTH_BACKGROUND: "/images/auth-bg.jpg", // This will be the path to our local image
};

export const OMDB_CONFIG = {
  BASE_URL: import.meta.env.VITE_OMDB_BASE_URL,
  API_KEY: import.meta.env.VITE_OMDB_API_KEY,
  SEARCH: import.meta.env.VITE_OMDB_SEARCH_PATH,
  DETAILS: import.meta.env.VITE_OMDB_DETAILS_PATH,
  TYPES: {
    MOVIE: import.meta.env.VITE_OMDB_TYPE_MOVIE,
    SERIES: import.meta.env.VITE_OMDB_TYPE_SERIES,
    EPISODE: import.meta.env.VITE_OMDB_TYPE_EPISODE,
  },
  PLOT: {
    SHORT: import.meta.env.VITE_OMDB_PLOT_SHORT,
    FULL: import.meta.env.VITE_OMDB_PLOT_FULL,
  },
  RESPONSE_TYPE: import.meta.env.VITE_OMDB_RESPONSE_TYPE,
  API_VERSION: import.meta.env.VITE_OMDB_API_VERSION,
};
