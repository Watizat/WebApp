import { Organism, Role, Zone } from '../@types/organism';
import { DirectusUser } from '../@types/user';
import { axiosInstance } from '../utils/axios';

let zonesCache: Zone[] | null = null;
let zonesPromise: Promise<Zone[]> | null = null;

export const clearZonesCache = () => {
  zonesCache = null;
  zonesPromise = null;
};

export const fetchAdminOrganisms = async ({
  city,
  isDisplayArchivedOrga = true,
}: {
  city: string;
  isDisplayArchivedOrga?: boolean;
}) => {
  const { data } = await axiosInstance.get<{ data: Organism[] }>(
    '/items/organisme',
    {
      params: {
        fields: ['id', 'name', 'address', 'visible', 'visible_comment'].join(
          ','
        ),
        filter: {
          zone_id: {
            name: city,
          },
          ...(isDisplayArchivedOrga ? {} : { visible: true }),
        },
      },
    }
  );
  return data.data;
};

export const fetchUsers = async (zone: string | null) => {
  const { data } = await axiosInstance.get<{ data: DirectusUser[] }>('/users', {
    params: {
      fields: [
        'id',
        'first_name',
        'last_name',
        'email',
        'role.id',
        'role.name',
        'zone',
        'last_access',
        'status',
      ].join(','),
      filter: {
        zone,
      },
    },
  });
  return data.data;
};

export const fetchAdminOrganism = async (id: number) => {
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
          'schedules.id',
          'schedules.day',
          'schedules.opentime_am',
          'schedules.closetime_am',
          'schedules.opentime_pm',
          'schedules.closetime_pm',
          'schedules.closed',
          'contacts.id',
          'contacts.name',
          'contacts.comment',
          'contacts.job',
          'contacts.phone',
          'contacts.mail',
          'contacts.visibility',
          'contacts.actualisation',
          'translations.id',
          'translations.description',
          'translations.infos_alerte',
          'services.id',
          'services.categorie_id.tag',
          'services.categorie_id.id',
          'services.categorie_id.translations.name',
          'services.categorie_id.translations.slug',
          'services.categorie_id.translations.description',
          'services.categorie_id.translations.',
          'services.translations.id',
          'services.translations.name',
          'services.translations.slug',
          'services.translations.infos_alerte',
          'services.translations.description',
          'services.schedules.*',
          'services.contacts.id',
          'services.contacts.name',
          'services.contacts.comment',
          'services.contacts.job',
          'services.contacts.mail',
          'services.contacts.phone',
          'services.contacts.visibility',
          'services.contacts.actualisation',
          'date_created',
          'date_updated',
        ].join(','),
        filter: {
          id,
        },
      },
    }
  );
  return data.data[0];
};

export const fetchZones = async (options?: { force?: boolean }) => {
  if (!options?.force && zonesCache) {
    return zonesCache;
  }
  if (!options?.force && zonesPromise) {
    return zonesPromise;
  }
  zonesPromise = axiosInstance
    .get<{ data: Zone[] }>('/items/zone')
    .then(({ data }) => {
      zonesCache = data.data;
      return zonesCache;
    })
    .finally(() => {
      zonesPromise = null;
    });
  return zonesPromise;
};

export const fetchRoles = async () => {
  const { data } = await axiosInstance.get<{ data: Role[] }>('/roles');
  return data.data;
};
