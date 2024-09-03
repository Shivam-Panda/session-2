import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import type { FunctionComponent } from 'react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import type { ContactRecord } from '../data';
import { getContact } from '../data';
import invariant from 'tiny-invariant';
import MAP from '../components/maps';
import { ClientOnly } from 'remix-utils/client-only';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.contactId, 'Missing contactId param');
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response('Not Found', { status: 404 });
    }
    return json({ contact });
};

export default function Contact() {
    return (
        <div id="contact">
            <ClientOnly
                fallback={<p>Loading...</p>}
                children={() => <MAP />}
            ></ClientOnly>
        </div>
    );
}
