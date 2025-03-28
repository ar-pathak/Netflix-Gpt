export const getFallbackMovies = (category) => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const upcomingMovies = [
        {
            Title: "Dune: Part Two",
            Year: nextYear,
            imdbID: "tt15239678",
            Type: "movie",
            Poster: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlNTU3ZWE1ZTEzXkEyXkFqcGdeQXVyMTQyMTMwOTk0._V1_SX300.jpg",
            imdbRating: "8.5"
        },
        {
            Title: "Deadpool 3",
            Year: nextYear,
            imdbID: "tt6263850",
            Type: "movie",
            Poster: "https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWIzMDYtZTk3MTQ3NGQkZDEwXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_SX300.jpg",
            imdbRating: "8.2"
        },
        {
            Title: "Joker: Folie à Deux",
            Year: nextYear,
            imdbID: "tt14209916",
            Type: "movie",
            Poster: "https://m.media-amazon.com/images/M/MV5BM2IxN2U0MTgtYzE0Ny00YjA3LTg3NDgtYzE0YzY5YjM5ZTM5XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
            imdbRating: "8.0"
        },
        {
            Title: "House of the Dragon",
            Year: currentYear,
            imdbID: "tt11198330",
            Type: "series",
            Poster: "https://m.media-amazon.com/images/M/MV5BZjBiOGQyNWUtN2M2Ni00Y2U2LTg5ZTMtZTM3NjIyYjVmNDk1XkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_SX300.jpg",
            imdbRating: "8.5"
        },
        {
            Title: "The Last of Us",
            Year: currentYear,
            imdbID: "tt3581920",
            Type: "series",
            Poster: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4ODEtN2Q0ZGJlNGZhYjc3XkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_SX300.jpg",
            imdbRating: "8.8"
        }
    ];

    switch (category) {
        case 'trending':
            return [
                {
                    Title: "Avengers: Endgame",
                    Year: "2019",
                    imdbID: "tt4154796",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
                    imdbRating: "8.4"
                },
                {
                    Title: "The Dark Knight",
                    Year: "2008",
                    imdbID: "tt0468569",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
                    imdbRating: "9.0"
                },
                {
                    Title: "Spider-Man: No Way Home",
                    Year: "2021",
                    imdbID: "tt10872600",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg",
                    imdbRating: "8.2"
                },
                {
                    Title: "Inception",
                    Year: "2010",
                    imdbID: "tt1375666",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
                    imdbRating: "8.8"
                },
                {
                    Title: "Interstellar",
                    Year: "2014",
                    imdbID: "tt0816692",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
                    imdbRating: "8.6"
                },
                {
                    Title: "The Matrix",
                    Year: "1999",
                    imdbID: "tt0133093",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "8.7"
                },
                {
                    Title: "Forrest Gump",
                    Year: "1994",
                    imdbID: "tt0109830",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
                    imdbRating: "8.8"
                },
                {
                    Title: "The Shawshank Redemption",
                    Year: "1994",
                    imdbID: "tt0111161",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
                    imdbRating: "9.3"
                },
                {
                    Title: "Fight Club",
                    Year: "1999",
                    imdbID: "tt0137523",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
                    imdbRating: "8.8"
                },
                {
                    Title: "The Godfather",
                    Year: "1972",
                    imdbID: "tt0068646",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                    imdbRating: "9.2"
                },
                {
                    Title: "Goodfellas",
                    Year: "1990",
                    imdbID: "tt0099685",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                    imdbRating: "8.7"
                },
                {
                    Title: "The Silence of the Lambs",
                    Year: "1991",
                    imdbID: "tt0102926",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "8.6"
                }
            ];
        case 'popular':
            return [
                {
                    Title: "Star Wars: Episode IV - A New Hope",
                    Year: "1977",
                    imdbID: "tt0076759",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg",
                    imdbRating: "8.6"
                },
                {
                    Title: "Jurassic Park",
                    Year: "1993",
                    imdbID: "tt0107290",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg",
                    imdbRating: "8.2"
                },
                {
                    Title: "The Lord of the Rings: The Fellowship of the Ring",
                    Year: "2001",
                    imdbID: "tt0120737",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
                    imdbRating: "8.9"
                },
                {
                    Title: "Pulp Fiction",
                    Year: "1994",
                    imdbID: "tt0110912",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                    imdbRating: "8.9"
                },
                {
                    Title: "Avatar",
                    Year: "2009",
                    imdbID: "tt0499549",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmMjcxYzI1MzlmXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
                    imdbRating: "7.9"
                },
                {
                    Title: "Titanic",
                    Year: "1997",
                    imdbID: "tt0120338",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
                    imdbRating: "7.9"
                },
                {
                    Title: "The Green Mile",
                    Year: "1999",
                    imdbID: "tt0120689",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg",
                    imdbRating: "8.6"
                },
                {
                    Title: "The Departed",
                    Year: "2006",
                    imdbID: "tt0407887",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg",
                    imdbRating: "8.5"
                },
                {
                    Title: "Gladiator",
                    Year: "2000",
                    imdbID: "tt0172495",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "8.5"
                },
                {
                    Title: "The Lion King",
                    Year: "1994",
                    imdbID: "tt0110357",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg",
                    imdbRating: "8.5"
                },
                {
                    Title: "Schindler's List",
                    Year: "1993",
                    imdbID: "tt0108052",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "9.0"
                },
                {
                    Title: "Saving Private Ryan",
                    Year: "1998",
                    imdbID: "tt0120815",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg",
                    imdbRating: "8.6"
                }
            ];
        case 'upcoming':
            return upcomingMovies;
        default:
            return [];
    }
}; 