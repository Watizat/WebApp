import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAppState } from '../../../hooks/appState';
import { registerUser as registerUserRequest } from '../../../api/user';
import { Inputs } from '../../../@types/formInputs';
import { validateEmail } from '../../../utils/form/form';
import Login from './Login';

export default function AccountRequest() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { adminState, setUserState } = useAppState();
  const { zones } = adminState;
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>();

  const onSubmit: SubmitHandler<Inputs> = async formData => {
    try {
      await registerUserRequest(formData);
      setUserState(prev => ({
        ...prev,
        message: 'Votre inscription à bien été prise en compte et va être vérifiée',
      }));
      return setConfirmationMessage(`Votre compte a bien été créé, il est en attente de validation.`);
    } catch (error) {
      setUserState(prev => ({
        ...prev,
        message: 'Erreur lors de la création du compte',
      }));
      return setConfirmationMessage(`Une erreur s'est produite lors de la création de votre compte.`);
    }
  };

  if (confirmationMessage) {
    return (
      <div className='flex flex-col items-center justify-center flex-1 max-w-3xl min-h-full gap-6 mx-auto align-middle'>
        <p className='text-lg text-slate-600'>{confirmationMessage}</p>
        <Link to='/'>
          <button
            className='flex w-full items-center gap-2 justify-center rounded-md bg-watizat-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-watizat-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-watizat-500 '
            type='button'
          >
            <i className='las la-arrow-left' />
            Retourner vers la page d&apos;accueil
          </button>
        </Link>
      </div>
    );
  }

  return (
    <Login>
      <div className='flex flex-col flex-1'>
        <div className='w-full max-w-sm mx-auto'>
          <h2 className='mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-slate-600'>
            Demande de création de compte
          </h2>
        </div>

        <div className='sm:mx-auto sm:w-full sm:max-w-3xl'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='email' className='block text-sm font-semibold leading-6 text-gray-600'>
                  Prénom
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    placeholder='Prénom'
                    {...register('first_name', {
                      required: 'Ce champs est requis',
                    })}
                    required
                    className='block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-watizat-500 sm:text-sm sm:leading-6'
                  />
                  {errors.first_name && <small className='text-red-600'>{errors.first_name.message}</small>}
                </div>
              </div>
              <div className='sm:col-span-3'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='block text-sm font-semibold leading-6 text-gray-600'>
                    Nom de famille / surnom / pseudo
                  </label>
                </div>
                <div className='mt-2'>
                  <input
                    type='text'
                    placeholder='Nom de famille'
                    {...register('last_name', {
                      required: 'Ce champs est requis',
                    })}
                    required
                    className='block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-watizat-500 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='email' className='block text-sm font-semibold leading-6 text-gray-600'>
                  Adresse email
                </label>
                <div className='mt-2'>
                  <input
                    type='email'
                    placeholder='Email'
                    {...register('email', {
                      validate: validateEmail,
                    })}
                    required
                    className='block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-watizat-500 sm:text-sm sm:leading-6'
                  />
                  {errors.mail?.message && <small className='text-red-600'>{errors.mail.message}</small>}
                </div>
              </div>
              <div className='sm:col-span-3'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='block text-sm font-semibold leading-6 text-gray-600'>
                    Mot de passe
                  </label>
                </div>
                <div className='mt-2'>
                  <input
                    type='password'
                    placeholder='Mot de passe'
                    {...register('password')}
                    required
                    className='block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-watizat-500 focus-visible:ring-watizat-500 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label htmlFor='location' className='block text-sm font-semibold leading-6 text-gray-600'>
                  Antenne locale
                </label>

                <select
                  {...register('zone')}
                  className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-watizat-600 sm:text-sm sm:leading-6 bg-white'
                >
                  <option value='' disabled>
                    Antenne local
                  </option>

                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='sm:col-span-3'>
                <p className='mt-4 ml-2 text-sm leading-6 text-justify text-gray-600'>
                  La création de compte est réservée aux membres actif·ve·s des de l&apos;association Watizat. Toute
                  demande devra être confirmée par un·e référent·e local
                </p>
              </div>
            </div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-watizat-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-watizat-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-watizat-500 '
            >
              Confirmer la demande
            </button>
          </form>
          <p className='mt-6 text-sm text-center text-gray-500'>
            Déjà membre ? &nbsp;
            <Link to='/login' className='font-semibold leading-6 text-watizat-500 hover:text-watizat-400'>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </Login>
  );
}
