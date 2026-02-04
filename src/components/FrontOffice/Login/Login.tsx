import FrontColor from '../../Container/FrontColor';
import NoMobile from '../../Errors/NoMobile';

interface PageProps {
  children: React.ReactNode;
}

export default function Login({ children }: PageProps) {
  return (
    <>
      <div className="md:hidden">
        <NoMobile />
      </div>
      <article className="hidden md:flex flex-col justify-center w-full h-full min-h-full my-auto">
        <FrontColor>{children}</FrontColor>
      </article>
    </>
  );
}
