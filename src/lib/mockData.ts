import heroBackdrop from "@/assets/hero-backdrop.jpg";
import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import poster5 from "@/assets/poster-5.jpg";
import poster6 from "@/assets/poster-6.jpg";
import poster7 from "@/assets/poster-7.jpg";
import poster8 from "@/assets/poster-8.jpg";

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

export const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    poster_path: poster1,
    backdrop_path: heroBackdrop,
    vote_average: 8.3,
    release_date: "2024-02-27",
    genre_ids: [878, 12],
    genres: ["Sci-Fi", "Adventure"],
    runtime: 166,
    trailer_key: "Way9Dexny3w",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: poster1 },
      { name: "Zendaya", character: "Chani", profile_path: poster1 },
      { name: "Austin Butler", character: "Feyd-Rautha", profile_path: poster1 },
    ],
  },
  {
    id: 2,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: poster2,
    backdrop_path: poster2,
    vote_average: 8.1,
    release_date: "2023-07-19",
    genre_ids: [18],
    genres: ["Drama", "History"],
    runtime: 180,
    trailer_key: "uYPbbksJxIg",
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: poster2 },
      { name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: poster2 },
    ],
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    poster_path: poster3,
    backdrop_path: poster3,
    vote_average: 7.7,
    release_date: "2022-03-01",
    genre_ids: [80, 9648, 53],
    genres: ["Crime", "Mystery", "Thriller"],
    runtime: 176,
    trailer_key: "mqqft2x_Aa4",
    cast: [
      { name: "Robert Pattinson", character: "Bruce Wayne", profile_path: poster3 },
    ],
  },
  {
    id: 4,
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led.",
    poster_path: poster4,
    backdrop_path: poster4,
    vote_average: 7.8,
    release_date: "2022-03-24",
    genre_ids: [28, 12, 878],
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 139,
    trailer_key: "wxN1T1uxQ2g",
    cast: [
      { name: "Michelle Yeoh", character: "Evelyn Wang", profile_path: poster4 },
    ],
  },
  {
    id: 5,
    title: "Blade Runner 2049",
    overview: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    poster_path: poster5,
    backdrop_path: poster5,
    vote_average: 7.5,
    release_date: "2017-10-04",
    genre_ids: [878, 18],
    genres: ["Sci-Fi", "Drama"],
    runtime: 164,
    trailer_key: "gCcx85zbxz4",
    cast: [
      { name: "Ryan Gosling", character: "K", profile_path: poster5 },
    ],
  },
  {
    id: 6,
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: poster6,
    backdrop_path: poster6,
    vote_average: 8.4,
    release_date: "2014-11-05",
    genre_ids: [12, 18, 878],
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    trailer_key: "zSWdZVtXT7E",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", profile_path: poster6 },
    ],
  },
  {
    id: 7,
    title: "Mad Max: Fury Road",
    overview: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken.",
    poster_path: poster7,
    backdrop_path: poster7,
    vote_average: 7.6,
    release_date: "2015-05-13",
    genre_ids: [28, 12, 878],
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 120,
    trailer_key: "hEJnMQG9ev8",
    cast: [
      { name: "Tom Hardy", character: "Max Rockatansky", profile_path: poster7 },
    ],
  },
  {
    id: 8,
    title: "Parasite",
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster_path: poster8,
    backdrop_path: poster8,
    vote_average: 8.5,
    release_date: "2019-05-30",
    genre_ids: [35, 53, 18],
    genres: ["Comedy", "Thriller", "Drama"],
    runtime: 132,
    trailer_key: "5xH0HfJHsaY",
    cast: [
      { name: "Song Kang-ho", character: "Ki-taek", profile_path: poster8 },
    ],
  },
];

export const FEATURED_MOVIE = MOCK_MOVIES[0];
