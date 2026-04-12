export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  genres: string[];
  runtime?: number;
  cast?: { name: string; character: string; profile_path: string }[];
  trailer_key?: string;
}

export const GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    poster_path: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7H.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    vote_average: 8.3,
    release_date: "2024-02-27",
    genre_ids: [878, 12],
    genres: ["Sci-Fi", "Adventure"],
    runtime: 166,
    trailer_key: "Way9Dexny3w",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg" },
      { name: "Zendaya", character: "Chani", profile_path: "https://image.tmdb.org/t/p/w185/tyUn0lHAlKh0rkYzp3HnMiGOQZ1.jpg" },
      { name: "Austin Butler", character: "Feyd-Rautha", profile_path: "https://image.tmdb.org/t/p/w185/ueXDCsFhGqFCoCpGlzQBiiBiXKq.jpg" },
    ],
  },
  {
    id: 2,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
    vote_average: 8.1,
    release_date: "2023-07-19",
    genre_ids: [18, 36],
    genres: ["Drama", "History"],
    runtime: 180,
    trailer_key: "uYPbbksJxIg",
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w185/dm6V24NjjvsXyPjHmPf80kxGLTy.jpg" },
      { name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w185/5nCSG5TL1bP1gew0t1xRRhKjzOV.jpg" },
    ],
  },
  {
    id: 3,
    title: "The Batman",
    overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    poster_path: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyFAJlB1YqigUyh0Gs.jpg",
    vote_average: 7.7,
    release_date: "2022-03-01",
    genre_ids: [80, 9648, 53],
    genres: ["Crime", "Mystery", "Thriller"],
    runtime: 176,
    trailer_key: "mqqft2x_Aa4",
    cast: [
      { name: "Robert Pattinson", character: "Bruce Wayne / The Batman", profile_path: "https://image.tmdb.org/t/p/w185/8A4PS4x2MTlQGnleVJdPWwejBev.jpg" },
      { name: "Zoë Kravitz", character: "Selina Kyle / Catwoman", profile_path: "https://image.tmdb.org/t/p/w185/sEDpsi0hXm8k8lCMBnsMXDtwKz0.jpg" },
    ],
  },
  {
    id: 4,
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led.",
    poster_path: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/fJjlblCFONwzNtyKJBLFxDwm0E6.jpg",
    vote_average: 7.8,
    release_date: "2022-03-24",
    genre_ids: [28, 12, 878],
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 139,
    trailer_key: "wxN1T1uxQ2g",
    cast: [
      { name: "Michelle Yeoh", character: "Evelyn Wang", profile_path: "https://image.tmdb.org/t/p/w185/6bBCPnM0Df5vxGBmifYkuhR8GVb.jpg" },
      { name: "Ke Huy Quan", character: "Waymond Wang", profile_path: "https://image.tmdb.org/t/p/w185/gJBMfhdCGE7yFRLNUUlPPuBq40U.jpg" },
    ],
  },
  {
    id: 5,
    title: "Blade Runner 2049",
    overview: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    poster_path: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg",
    vote_average: 7.5,
    release_date: "2017-10-04",
    genre_ids: [878, 18],
    genres: ["Sci-Fi", "Drama"],
    runtime: 164,
    trailer_key: "gCcx85zbxz4",
    cast: [
      { name: "Ryan Gosling", character: "K", profile_path: "https://image.tmdb.org/t/p/w185/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg" },
      { name: "Harrison Ford", character: "Rick Deckard", profile_path: "https://image.tmdb.org/t/p/w185/5M7oN3sznp99hWYQ9sX0txRiV2B.jpg" },
    ],
  },
  {
    id: 6,
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xJHokMbljXjADYdit5fK1DDtjmp.jpg",
    vote_average: 8.4,
    release_date: "2014-11-05",
    genre_ids: [12, 18, 878],
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    trailer_key: "zSWdZVtXT7E",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", profile_path: "https://image.tmdb.org/t/p/w185/wJiGedOCZhwMx9DezY8uwbNxmKp.jpg" },
      { name: "Anne Hathaway", character: "Brand", profile_path: "https://image.tmdb.org/t/p/w185/s6mHPm3B3c0pCTAGuJSnmmPAE1q.jpg" },
    ],
  },
  {
    id: 7,
    title: "Mad Max: Fury Road",
    overview: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken.",
    poster_path: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/phszHPFVhPHhMZgo0fWTKBDQsJA.jpg",
    vote_average: 7.6,
    release_date: "2015-05-13",
    genre_ids: [28, 12, 878],
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 120,
    trailer_key: "hEJnMQG9ev8",
    cast: [
      { name: "Tom Hardy", character: "Max Rockatansky", profile_path: "https://image.tmdb.org/t/p/w185/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg" },
      { name: "Charlize Theron", character: "Imperator Furiosa", profile_path: "https://image.tmdb.org/t/p/w185/1kWg9m3Xw8hP2tMMXsFfO2YjXi6.jpg" },
    ],
  },
  {
    id: 8,
    title: "Parasite",
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster_path: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    vote_average: 8.5,
    release_date: "2019-05-30",
    genre_ids: [35, 53, 18],
    genres: ["Comedy", "Thriller", "Drama"],
    runtime: 132,
    trailer_key: "5xH0HfJHsaY",
    cast: [
      { name: "Song Kang-ho", character: "Ki-taek", profile_path: "https://image.tmdb.org/t/p/w185/vFS4atgOaacTGDgijmBScgIgr6G.jpg" },
      { name: "Cho Yeo-jeong", character: "Yeon-gyo", profile_path: "https://image.tmdb.org/t/p/w185/3sBLtnvGSv0vrjGwTQCUXZCLrMN.jpg" },
    ],
  },
];

export const FEATURED_MOVIE = MOCK_MOVIES[0];
