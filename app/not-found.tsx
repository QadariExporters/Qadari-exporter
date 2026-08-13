import Link from 'next/link';
export default function NotFound() { return <main className="page-main not-found"><p className="eyebrow">404</p><h1>That page has<br /><em>moved on.</em></h1><Link href="/products" className="button button-dark">Browse the collection</Link></main>; }
