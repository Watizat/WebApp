import { Categorie, Days, Organism } from '../@types/organism';
import { axiosInstance } from '../utils/axios';

export const fetchCityPosition = async (city: string | null) => {
  let cityRequest = city;
  if (!cityRequest) {
    cityRequest = 'Toulouse';
  }
  const { data } = await axiosInstance.get('/items/zone', {
    params: {
      filter: {
        name: cityRequest,
      },
    },
  });
  return data.data[0];
};

export const fetchOrganisms = async (city: string) => {
  const { data } = await axiosInstance.get<{ data: Organism[] }>(
    '/items/organisme',
    {
      params: {
        fields: [
          'id',
          'name',
          'slug',
          'address',
          'city',
          'zipcode',
          'latitude',
          'longitude',
          'comment',
          'visible',
          'visible_comment',
          'pmr',
          'animals',
          'phone',
          'mail',
          'website',
          'zone_id.name',
          'schedules.*',
          'contacts.name',
          'contacts.job',
          'contacts.phone',
          'contacts.mail',
          'contacts.visibility',
          'contacts.actualisation',
          'translations.id',
          'translations.description',
          'translations.infos_alerte',
          'services.categorie_id.id',
          'services.categorie_id.tag',
          'services.categorie_id.translations.id',
          'services.categorie_id.translations.name',
          'services.categorie_id.translations.slug',
          'services.categorie_id.translations.description',
          'services.categorie_id.translations.',
          'services.translations.name',
          'services.translations.slug',
          'services.translations.infos_alerte',
          'services.translations.description',
          'services.schedules.day',
          'services.schedules.opentime_am',
          'services.schedules.closetime_am',
          'services.schedules.opentime_pm',
          'services.schedules.closetime_pm',
          'services.schedules.closetime_pm',
          'services.contacts.name',
          'services.contacts.job',
          'services.contacts.mail',
          'services.contacts.phone',
          'services.contacts.visibility',
          'services.contacts.actualisation',
        ].join(','),
        filter: {
          zone_id: {
            name: { _icontains: city },
          },
        },
      },
    }
  );
  return data.data;
};

export const fetchDays = async (langueId: number) => {
  const { data } = await axiosInstance.get<{ data: Days[] }>(
    '/items/day_translation',
    {
      params: {
        fields: ['name', 'numberday'],
        filter: { langue: langueId },
        sort: 'numberday',
      },
    }
  );
  return data.data;
};

export const fetchOrganism = async (slug: string) => {
  const { data } = await axiosInstance.get<{ data: Organism[] }>(
    '/items/organisme',
    {
      params: {
        fields: [
          'id',
          'name',
          'slug',
          'address',
          'city',
          'zipcode',
          'latitude',
          'longitude',
          'comment',
          'visible',
          'visible_comment',
          'pmr',
          'animals',
          'phone',
          'mail',
          'website',
          'zone_id.name',
          'schedules.*',
          'contacts.name',
          'contacts.job',
          'contacts.phone',
          'contacts.mail',
          'contacts.visibility',
          'contacts.actualisation',
          'translations.id',
          'translations.description',
          'translations.infos_alerte',
          'services.id',
          'services.categorie_id.id',
          'services.categorie_id.tag',
          'services.categorie_id.translations.name',
          'services.categorie_id.translations.slug',
          'services.categorie_id.translations.description',
          'services.categorie_id.translations.',
          'services.translations.id',
          'services.translations.name',
          'services.translations.slug',
          'services.translations.infos_alerte',
          'services.translations.description',
          'services.schedules.day',
          'services.schedules.opentime_am',
          'services.schedules.closetime_am',
          'services.schedules.opentime_pm',
          'services.schedules.closetime_pm',
          'services.schedules.closetime_pm',
          'services.contacts.name',
          'services.contacts.job',
          'services.contacts.mail',
          'services.contacts.phone',
          'services.contacts.visibility',
          'services.contacts.actualisation',
        ].join(','),
        filter: {
          zone_id: {
            name: 'Toulouse',
          },
          slug: `${slug}`,
        },
      },
    }
  );
  return data.data.length === 0 ? null : data.data[0];
};

export const fetchCategories = async () => {
  const { data } = await axiosInstance.get<{ data: Categorie[] }>(
    '/items/categorie?fields=id,tag,translations.name,translations.slug',
    {
      params: {
        sort: 'translations.name',
      },
    }
  );
  return data.data;
};
