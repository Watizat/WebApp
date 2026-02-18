import { useAppState } from '../../../hooks/appState';

export default function Watizat() {
  const { themeMode } = useAppState();
  const isDark = themeMode === 'dark';

  return (
    <section className="overflow-hidden">
      <div className="px-6 mx-auto max-w-7xl lg:flex lg:px-8">
        <div className="grid max-w-2xl grid-cols-1 mx-auto gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2
              className={`text-3xl font-bold tracking-tight sm:text-4xl ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              Watizat milite pour l’accès à l’information des personnes exilées
            </h2>
            <p className={`mt-6 text-lg leading-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              L’association WATIZAT milite pour l’accès à l’information des
              personnes exilées en France. Nous constatons que l’information est
              une ressource vitale qui peut avoir des conséquences importantes
              sur le parcours de ces personnes, d’autant plus lorsqu’elles sont
              étrangères et en situation de précarité. La transmission d’une
              information correcte et traduite peut faciliter l’accès aux droits
              des personnes et leur donner une meilleure compréhension des
              services et des acteur·ice·s présents sur le territoire.
            </p>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            <div className="flex-auto w-0 lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
              <img
                src="https://watizat.org/wp-content/uploads/2022/11/DSC01124-800x533.jpeg"
                alt=""
                className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
              />
            </div>
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              <div className="flex self-end justify-end flex-none order-first w-64 lg:w-auto">
                <img
                  src="https://watizat.org/wp-content/uploads/2022/10/Formation-800x615.jpg"
                  alt=""
                  className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
              <div className="flex justify-end flex-auto w-96 lg:w-auto lg:flex-none">
                <img
                  src="https://www.leparisien.fr/resizer/eAo8mMY53ZWpBgIjGhCNJdKlLUQ=/932x582/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/BHJENZG3YMKLMX5ERK6RCFIPBM.jpg"
                  alt=""
                  className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
              <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                <img
                  src="https://watizat.org/wp-content/uploads/2022/11/Watizat_support_dinformation-800x1065.jpg"
                  alt=""
                  className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
