/**
 * I-Stream — main.js
 * ─────────────────────────────────────────────────────────
 * This is where you manage your movie catalogue.
 * Add, remove, or edit entries in the MOVIES array below.
 *
 * LINKING YOUR VIDEO FILES
 * ────────────────────────
 * Each movie has a `src` field. Set it to the path of your
 * video file. Paths are relative to the build/ folder.
 *
 * Examples:
 *   src: 'assets/my-movie.mp4'          inside build/assets/
 *   src: '../assets/my-movie.mp4'       one folder up
 *   src: '../../Videos/film.mp4'        two folders up
 *
 * Leave src as an empty string ('') if you haven't linked
 * a file yet — the card will show a "No Source" badge.
 *
 * POSTER & BACKDROP IMAGES
 * ────────────────────────
 * Point poster and backdrop to local image files the same
 * way, or use any public image URL.
 *
 * AVAILABLE FIELDS
 * ────────────────
 *   id        (required) Unique integer
 *   title     (required) Movie title
 *   genre     (required) Array of genre strings
 *   src       Path to your video file
 *   poster    Portrait image (2:3 ratio recommended)
 *   backdrop  Widescreen image (16:9 ratio recommended)
 *   year      Release year
 *   rating    Score out of 10 (one decimal)
 *   dur       Duration e.g. '1h 52m'
 *   director  Director name
 *   cast      Array of actor names
 *   desc      Short synopsis
 *   featured  true = shown in the hero banner
 * ─────────────────────────────────────────────────────────
 */

const MOVIES = [
  {
    id: 1,
    title: 'Sample Movie One',
    src: '/build/assets/dark_knight.mp4',             // ← replace with your path
    poster: '/build/assets/img/samplevid1.jpg',
    backdrop: '/build/assets/img/coloured-forest.jpg',
    year: 2024,
    rating: 8.4,
    dur: '2h 05m',
    genre: ['Action', 'Sci-Fi'],
    director: 'Director Name',
    cast: ['Actor One', 'Actor Two', 'Actor Three'],
    desc: 'A short description of the movie goes here. Keep it to 2–3 sentences for the best display in the hero and detail views.',
    featured: true
  },
  {
    id: 2,
    title: 'Sample Movie Two',
    src: 'https://www.youtube.com/watch?v=YV2cW6ybY0M',                                   // ← no source yet
    poster: 'https://picsum.photos/seed/is2p/300/450',
    backdrop: 'https://picsum.photos/seed/is2b/1280/720',
    year: 2023,
    rating: 7.9,
    dur: '1h 48m',
    genre: ['Drama', 'Thriller'],
    director: 'Director Name',
    cast: ['Actor One', 'Actor Two'],
    desc: 'A short description of the movie goes here.',
    featured: false
  },
  {
    id: 3,
    title: 'Sample Movie Three',
    src: '',
    poster: 'https://picsum.photos/seed/is3p/300/450',
    backdrop: 'https://picsum.photos/seed/is3b/1280/720',
    year: 2023,
    rating: 8.1,
    dur: '2h 12m',
    genre: ['Horror', 'Mystery'],
    director: 'Director Name',
    cast: ['Actor One', 'Actor Two', 'Actor Three'],
    desc: 'A short description of the movie goes here.',
    featured: false
  },
  {
    id: 4,
    title: 'Sample Movie Four',
    src: '',
    poster: 'https://picsum.photos/seed/is4p/300/450',
    backdrop: 'https://picsum.photos/seed/is4b/1280/720',
    year: 2024,
    rating: 9.0,
    dur: '2h 30m',
    genre: ['Fantasy', 'Adventure'],
    director: 'Director Name',
    cast: ['Actor One', 'Actor Two'],
    desc: 'A short description of the movie goes here.',
    featured: false
  },
  {
    id: 5,
    title: 'Sample Movie Five',
    src: '',
    poster: 'https://fastly.picsum.photos/id/321/1280/720.jpg?hmac=K3v5yd5u3HFb1n643UewttWyM307StJ-2koS4sIkU5I',
    backdrop: 'https://picsum.photos/seed/is5b/1280/720',
    year: 2022,
    rating: 7.6,
    dur: '1h 55m',
    genre: ['Romance', 'Drama'],
    director: 'Director Name',
    cast: ['Actor One', 'Actor Two', 'Actor Three'],
    desc: 'A short description of the movie goes here.',
    featured: false
  }


];