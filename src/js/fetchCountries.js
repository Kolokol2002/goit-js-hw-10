const fetchCountries = name => {
  const URL = `https://restcountries.com/v3.1/name/${name}?fields=name,flags,capital,population,languages`;

  return fetch(URL).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
};

export default { fetchCountries };
