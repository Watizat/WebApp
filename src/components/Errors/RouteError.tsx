import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import ProgressiveImage from 'react-progressive-graceful-image';

export default function RouteError() {
  const error = useRouteError();

  let title = 'Une erreur inattendue est survenue';
  let details = 'Merci de reessayer dans quelques instants.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} - ${error.statusText}`;
    details = typeof error.data === 'string' ? error.data : details;
  } else if (error instanceof Error && error.message) {
    details = error.message;
  }

  return (
    <main className='min-h-full'>
      <ProgressiveImage
        src='https://unsplash.com/photos/_J_7Cj5CTAI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fGxvc3R8ZW58MHwwfHx8MTY5ODk5MDAyNHww&force=true&w=2400'
        placeholder='https://unsplash.com/photos/_J_7Cj5CTAI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fGxvc3R8ZW58MHwwfHx8MTY5ODk5MDAyNHww&force=true&w=40'
      >
        {(src, loading) => (
          <img
            className={`image${
              loading ? ' loading' : ' loaded'
            } absolute inset-0 object-cover object-top w-full h-full -z-10`}
            src={src}
            alt='error page background'
          />
        )}
      </ProgressiveImage>

      <div className='px-6 py-32 mx-auto text-center max-w-7xl sm:py-40 lg:px-8'>
        <p className='text-2xl font-semibold leading-8 text-white'>Erreur application</p>
        <h1 className='mt-4 text-5xl font-bold tracking-tight text-white sm:text-4xl'>{title}</h1>
        <p className='mt-4 text-lg text-slate-100 sm:mt-6'>{details}</p>
        <div className='flex justify-center mt-10'>
          <Link to='/' className='text-lg font-semibold leading-7 text-white'>
            <span aria-hidden='true'>&larr;</span> Retourner a l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
