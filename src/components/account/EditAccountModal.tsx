import React, { useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface EditAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    roleId: string;
    profile: Partial<ProfileDTO>;
  }) => void;
  account: AccountDTO;
  roles: RoleDTO[];
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  open,
  onClose,
  onSubmit,
  account,
  roles,
}) => {
  const { control, handleSubmit, setValue } = useForm();

  useEffect(() => {
    setValue('email', account.email);
    setValue('roleId', account.role?.id || '');
    setValue('profile.firstName', account.profile?.firstName || '');
    setValue('profile.lastName', account.profile?.lastName || '');
    setValue('profile.phoneNumber', account.profile?.phoneNumber || '');
    setValue('profile.address', account.profile?.address || '');
    setValue('profile.dateOfBirth', account.profile?.dateOfBirth || '');
  }, [account, setValue]);

  const onFormSubmit = handleSubmit((data) => {
    // onSubmit(data);
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-gray-1000 flex min-h-screen items-center justify-center">
        <form
          className="mx-auto w-full max-w-2xl rounded-lg bg-white p-10 shadow-lg"
          onSubmit={onFormSubmit}
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Edit Account
          </h2>
          <div className="mb-5 flex gap-4">
            <div className="group relative z-0 w-1/2">
              <Controller
                name="profile.firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'First name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      id="floating_first_name"
                      className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_first_name"
                      className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                    >
                      First name
                    </label>
                    {error && (
                      <span className="text-xs text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="group relative z-0 w-1/2">
              <Controller
                name="profile.lastName"
                control={control}
                defaultValue=""
                rules={{ required: 'Last name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      id="floating_last_name"
                      className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_last_name"
                      className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                    >
                      Last name
                    </label>
                    {error && (
                      <span className="text-xs text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: 'Email is required', pattern: /^\S+@\S+$/i }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    type="email"
                    {...field}
                    id="floating_email"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_email"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                  >
                    Email address
                  </label>
                  {error && (
                    <span className="text-xs text-red-500">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <Controller
              name="profile.dateOfBirth"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="date"
                    {...field}
                    id="floating_date_of_birth"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_date_of_birth"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                  >
                    Date of Birth
                  </label>
                </>
              )}
            />
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <Controller
              name="profile.phoneNumber"
              control={control}
              defaultValue=""
              // rules={{ required: 'Phone number is required' }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    type="tel"
                    {...field}
                    id="floating_phone"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_phone"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                  >
                    Phone Number
                  </label>
                  {error && (
                    <span className="text-xs text-red-500">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <Controller
              name="profile.address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    {...field}
                    id="floating_address"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_address"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                  >
                    Address
                  </label>
                </>
              )}
            />
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <Controller
              name="roleId"
              control={control}
              defaultValue=""
              // rules={{ required: 'Role is required' }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <select
                    {...field}
                    id="floating_role"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="floating_role"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                  >
                    Role
                  </label>
                  {error && (
                    <span className="text-xs text-red-500">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-red-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Update Account
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditAccountModal;
