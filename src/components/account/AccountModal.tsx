import React from 'react';
import { Modal, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CreateAccountRequest } from '@/service/accountService';
import SubmitButton from '../SubmitButton';
import CancelButton from '../CancelButton';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountRequest) => void;
  onChange: () => void;
  roles: RoleDTO[];
  userPermissions: string[];
}

const AccountModal: React.FC<AccountModalProps> = ({
  open,
  onClose,
  onSubmit,
  onChange,
  roles,
  userPermissions,
}) => {
  const { control, handleSubmit } = useForm<CreateAccountRequest>();
  const onFormSubmit = handleSubmit((data) => {
    // console.log(data);
    onSubmit(data);
    onClose();
  });

  // Check if user has the 'account:assign-role' permission
  const canAssignRole = userPermissions.includes('account:assign-role');

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-gray-1000 flex min-h-screen items-center justify-center">
        <form
          className="mx-auto w-full max-w-2xl rounded-lg bg-white p-10 shadow-lg"
          onSubmit={onFormSubmit}
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Create New Account
          </h2>
          <div className="mb-5 flex gap-4">
            <div className="group relative z-0 w-1/2">
              <Controller
                name="firstName"
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
                      onChange={(e) => {
                        field.onChange(e);
                        onChange();
                      }}
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
                name="lastName"
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
                      onChange={(e) => {
                        field.onChange(e);
                        onChange();
                      }}
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
                    onChange={(e) => {
                      field.onChange(e);
                      onChange();
                    }}
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
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'password is required',
                minLength: 6,
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    type="password"
                    {...field}
                    id="floating_password"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    required
                    onChange={(e) => {
                      field.onChange(e);
                      onChange();
                    }}
                  />
                  <label
                    htmlFor="floating_password"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
                  >
                    Password
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

          {canAssignRole && (
            <div className="group relative z-0 mb-5 w-full">
              <Controller
                name="roleId"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <>
                    <select
                      {...field}
                      id="floating_role"
                      className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                      onChange={(e) => {
                        field.onChange(e);
                        onChange();
                      }}
                    >
                      <option value="">Select a role</option>
                      {roles?.map((role) => (
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
          )}

          <div className="flex justify-end gap-4">
            <CancelButton onClick={onClose} />
            <SubmitButton>Create Account</SubmitButton>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AccountModal;
