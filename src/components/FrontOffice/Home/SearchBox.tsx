import { ChangeEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../../ui/icon/icon';
import { useAppState } from '../../../hooks/appState';
import FrontColor from '../../Container/FrontColor';

export default function SearchBox() {
  const navigate = useNavigate();
  const { adminState, organismState, themeMode } = useAppState();
  const { categories } = organismState;
  const { zones: cities } = adminState;
  const isDark = themeMode === 'dark';

  const [selectedValues, setSelectedValues] = useState({
    city: '',
    category: '',
  });

  const [cityEmpty, setCityEmpty] = useState(false);
  const [categoryEmpty, setCategoryEmpty] = useState(false);
  const [allEmpty, setAllEmpty] = useState(false);

  function initErros() {
    setCityEmpty(false);
    setCategoryEmpty(false);
    setAllEmpty(false);
  }

  const handleChangeCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      city: event.target.value,
    }));
    initErros();
  };

  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
    initErros();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('city', selectedValues.city); // localStorage est récupéré par Leaflet pour afficher la map dans "Resultats"
    if (selectedValues.city && selectedValues.category) {
      const encodedCategory = encodeURIComponent(selectedValues.category);
      navigate(
        `resultats/?city=${selectedValues.city.toLowerCase()}&category=${encodedCategory}`
      );
    } else if (!selectedValues.city && !selectedValues.category) {
      setAllEmpty(true);
    } else if (!selectedValues.category) {
      setCategoryEmpty(true);
    } else if (!selectedValues.city) {
      setCityEmpty(true);
    }
  };

  return (
    <FrontColor>
      <section className="flex flex-col items-center gap-6 px-6 mx-auto max-w-7xl lg:gap-14 ">
        <div className="max-w-2xl mx-auto text-center">
          <h1
            className={`text-4xl font-bold tracking-tight sm:text-6xl ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            Watizat
          </h1>
          <p
            className={`mt-2 text-xl leading-8 md:mt-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Guide numérique
          </p>
        </div>
        <div
          className={`flex flex-col items-center justify-center w-full h-full gap-2 p-6 mx-auto shadow-sm sm:gap-4 md:w-4/6 rounded-xl ring-1 ring-inset ring-watizat-500/20 lg:rounded-2xl lg:p-8 ${
            isDark ? 'bg-gray-800/70' : 'md:bg-slate-100/20'
          }`}
        >
          <div className="flex flex-col items-center justify-center w-4/5 text-center gap-y-4">
            <h3
              className={`mb-2 text-2xl font-semibold leading-6 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              Rechercher un organisme
            </h3>

            <p
              className={`leading-tight md:leading-8 text-md ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Sélectionnez une zone géographique ainsi qu&apos;une catégorie
            </p>
          </div>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <div className="grid w-full py-4 divide-x-0 divide-gray-200 md:p-4 gap-y-4 lg:divide-x lg:grid-cols-2">
              <div className="flex flex-col justify-center w-full px-4 m-auto ">
                <label
                  htmlFor="location"
                  className={`block text-sm font-semibold leading-6 ${
                    isDark ? 'text-gray-200' : 'text-slate-700'
                  }`}
                >
                  1 . Zone géographique
                </label>
                <select
                  id="city"
                  value={selectedValues.city}
                  onChange={handleChangeCity}
                  className={`block w-full py-2 pl-3 pr-10 mt-2 border-0 rounded-md ring-1 ring-inset focus:ring-2 focus:ring-watizat-500 sm:text-sm sm:leading-6 ${
                    isDark
                      ? 'text-gray-100 bg-gray-900 ring-gray-700'
                      : 'text-gray-900 bg-white ring-gray-300'
                  }`}
                >
                  <option value="" disabled>
                    Selectionner une zone...
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-center w-full px-4 m-auto ">
                <label
                  htmlFor="category"
                  className={`block text-sm font-semibold leading-6 ${
                    isDark ? 'text-gray-200' : 'text-slate-700'
                  }`}
                >
                  2 . Catégorie
                </label>
                <select
                  id="category"
                  value={selectedValues.category}
                  onChange={handleChangeCategory}
                  className={`block w-full py-2 pl-3 pr-10 mt-2 border-0 rounded-md ring-1 ring-inset focus:ring-2 focus:ring-watizat-500 sm:text-sm sm:leading-6 ${
                    isDark
                      ? 'text-gray-100 bg-gray-900 ring-gray-700'
                      : 'text-gray-900 bg-white ring-gray-300'
                  }`}
                >
                  <option value="" disabled>
                    Selectionner une catégorie...
                  </option>
                  {categories.map((categorie) => (
                    <option
                      className="flex"
                      key={categorie.translations[0].slug}
                      value={categorie.translations[0].slug}
                    >
                      {categorie.translations[0].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {cityEmpty || categoryEmpty || allEmpty ? (
              <p className="text-sm font-medium text-center text-red-600">
                {cityEmpty
                  ? 'Merci de bien vouloir sélectionner une zone géographique'
                  : ''}
                {categoryEmpty
                  ? 'Merci de bien vouloir sélectionner une catégorie'
                  : ''}
                {allEmpty
                  ? 'Merci de bien vouloir sélectionner une zone géographique et une catégorie'
                  : ''}
              </p>
            ) : (
              <p className="text-sm font-medium text-center text-transparent">
                Merci de bien vouloir sélectionner une zone géographique et une
                catégorie
              </p>
            )}
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="flex  w-full md:w-2/5 justify-center rounded-md bg-watizat-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-watizat-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-watizat-500"
              >
                Lancer la recherche
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center gap-x-6">
          <Link
            to="/guides-papier"
            className={`text-sm font-semibold leading-6 ${
              isDark ? 'text-gray-100' : 'text-zincslate-700'
            }`}
          >
            Le guide existe aussi en version papier{' '}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </FrontColor>
  );
}
