////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
// @ts-expect-error - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';

type CityData = {
    id: string;
    title: string;
};

const CITY_DATA: CityData[] = [
    {
        id: 'nyc',
        title: 'NYC Tree Data 2015',
    },
    {
        id: 'sf',
        title: 'San Francisco Bike Parking',
    },
    {
        id: 'mi',
        title: 'Michigan Hospitalization Rates',
    },
    {
        id: 'pa',
        title: 'Pennsylvania Drug Busts',
    },
];

export async function getCityData(query?: string | null) {
    if (query) {
        return matchSorter(CITY_DATA, query, {
            keys: ['id'],
        });
    }
    return CITY_DATA;
}

// Handful of helper functions to be called from route loaders and actions
// export async function getContacts(query?: string | null) {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     let contacts = await fakeContacts.getAll();
//     if (query) {
//         contacts = matchSorter(contacts, query, {
//             keys: ['first', 'last'],
//         });
//     }
//     return contacts.sort(sortBy('last', 'createdAt'));
// }
