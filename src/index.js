import './css/styles.css';
import API from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const target = e.target.value.trim();
  if (target === '') {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
    return;
  }
  API.fetchCountries(target)
    .then(data => {
      if (data.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length <= 10 && data.length >= 2) {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = createMarkupListCountry(data);
      } else if (data.length === 1) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = createMarkupOneCountry(data);
      }
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupListCountry(data) {
  return [...data]
    .map(({ flags, name }) => {
      return `
          <li class="country">
            <img class="flags" src="${flags.svg}" alt="${flags.alt}">
            <span class="country_name">${name.common}</span>
        </li>
        `;
    })
    .join('');
}

function createMarkupOneCountry(data) {
  return [...data]
    .map(({ flags, name, capital, languages, population }) => {
      return `
            <div class="country-info-title-container">
                <img class="country-info-flag" src="${flags.png}" alt="${
        flags.alt
      }" />
                <h1 class="country-info-title">${name.common}</h1>
            </div>
            <p class="country-info-subtitle">
                Capital:
                <span class="country-info-subtitle-info">${capital[0]}</span>
            </p>
            <p class="country-info-subtitle">
                Population:
                <span class="country-info-subtitle-info">${population}</span>
            </p>
            <p class="country-info-subtitle">
                Languages:
                <span class="country-info-subtitle-info">${Object.values(
                  languages
                ).join(', ')}</span>
            </p>
        `;
    })
    .join('');
}
