import {
    Form,
    Link,
    Links,
    Meta,
    NavLink,
    Outlet,
    redirect,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/server-runtime';
import appStyleHref from './app.css?url';
import { getCityData } from './data';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useEffect } from 'react';
import stylesheet from '~/tailwind.css?url';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: appStyleHref },
    { rel: 'stylesheet', href: stylesheet },
];

// export const action = async () => {
//     const contact = await createEmptyContact();
//     return redirect(`/contacts/${contact.id}/edit`);
// };

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const cityData = await getCityData();
    return json({ cityData, q });
};

export default function App() {
    const { cityData, q } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has('q');

    useEffect(() => {
        const searchField = document.getElementById('q');
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || '';
        }
    }, [q]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <div id="sidebar">
                    <h1>Remix Contacts</h1>
                    <div
                        className={
                            navigation.state === 'loading' && !searching
                                ? 'loading'
                                : ''
                        }
                    >
                        <Form
                            onChange={(e) => {
                                const isFirstSearch = q === null;
                                submit(e.currentTarget, {
                                    replace: !isFirstSearch,
                                });
                            }}
                            id="search-form"
                            role="search"
                        >
                            <Input
                                id="q"
                                aria-label="Search contacts"
                                defaultValue={q || ''}
                                placeholder="Search"
                                type="search"
                                name="q"
                                className={searching ? 'loading' : ''}
                            />
                            <div
                                id="search-spinner"
                                aria-hidden
                                hidden={true}
                            />
                        </Form>
                    </div>
                    <nav>
                        {cityData.length ? (
                            <ul>
                                {cityData.map((data: any) => (
                                    <li key={data.id}>
                                        <NavLink
                                            className={({
                                                isActive,
                                                isPending,
                                            }) =>
                                                isActive
                                                    ? 'active'
                                                    : isPending
                                                      ? 'pending'
                                                      : ''
                                            }
                                            to={`data/${data.id}`}
                                        >
                                            <Button>{data.title}</Button>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                <i>No contacts</i>
                            </p>
                        )}
                    </nav>
                </div>
                <div
                    className={navigation.state === 'loading' ? 'loading' : ''}
                    id="detail"
                >
                    <Outlet />
                </div>

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
