import { useFetcher, useLoaderData } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { getCityData } from '../data';
import invariant from 'tiny-invariant';
import MAP from '../components/maps';
import { ClientOnly } from 'remix-utils/client-only';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.dataId, 'Missing contactId param');
    const data = await getCityData(params.dataId);

    if (!data) {
        throw new Response('Not Found', { status: 404 });
    }
    if (data.length !== 1) {
        throw new Response('Bad Input', { status: 400 });
    }

    return json({ data });
};

export default function Contact() {
    const { data } = useLoaderData<typeof loader>();

    console.log({ data });

    return (
        <div id="contact">
            <ClientOnly fallback={<p>Loading...</p>}>
                {() => <MAP cityDataID={data[0].id} />}
            </ClientOnly>
        </div>
    );
}
