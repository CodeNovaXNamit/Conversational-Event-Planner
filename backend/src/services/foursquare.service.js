const axios = require("axios");
const { FOURSQUARE_API_KEY } = require("../config/env");

async function searchVenues(query, near) {
  const url = "https://api.foursquare.com/v3/places/search";

  const res = await axios.get(url, {
    headers: {
      Authorization: FOURSQUARE_API_KEY,
    },
    params: {
      query,
      near,
      limit: 5,
    },
  });

  return res.data.results.map((v) => ({
    id: v.fsq_id,
    name: v.name,
    address: v.location.formatted_address,
    categories: v.categories?.map((c) => c.name),
    rating: Math.round(Math.random() * 5 * 10) / 10, // fake rating for demo
  }));
}

module.exports = { searchVenues };
