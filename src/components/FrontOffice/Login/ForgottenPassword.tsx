import { Link } from 'react-router-dom';
import { ChangeEvent, FormEvent } from 'react';
import { useAppState } from '../../../hooks/appState';
import { askPassword } from '../../../api/user';
import Login from './Login';

export default function ForgottenPassword() {
  const { userState, setUserState } = useAppState();
  const { loginCredentials, message } = userState;
  const { email } = loginCredentials;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserState((prev) => ({
      ...prev,
      loginCredentials: {
        ...prev.loginCredentials,
        email: event.target.value,
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUserState((prev) => ({ ...prev, isLoading: true }));
    askPassword(email)
      .then(() => {
        setUserState((prev) => ({
          ...prev,
          isLoading: false,
          message: 'Le mail a bien été envoyé',
          error: null,
        }));
      })
      .catch(() => {
        setUserState((prev) => ({
          ...prev,
          isLoading: false,
          message: null,
          error: 'Une erreur est survenue lors de la demande de mot de passe',
        }));
      });
  };

  return (
    <Login>
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-slate-600">
            Mot de passé oublié
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-600"
              >
                Adresse email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  onChange={handleChange}
                  value={email}
                  placeholder="Email"
                  required
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-watizat-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-watizat-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-watizat-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-watizat-500"
              >
                Demander la réinitialisation
              </button>
              {message && (
                <p className="mt-6 text-xs font-medium text-center text-slate-500">
                  {message}
                </p>
              )}
            </div>
          </form>
          <p className="mt-6 text-sm text-center text-gray-500">
            Pas encore membre ?<br />
            <Link
              to="/account-request"
              className="font-semibold leading-6 text-watizat-500 hover:text-watizat-400"
            >
              Faire une demande de compte
            </Link>
          </p>
        </div>
      </div>
    </Login>
  );
}
