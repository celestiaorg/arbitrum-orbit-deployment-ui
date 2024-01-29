import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useFormContext } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';

type SetValidatorsProps = {
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
  walletCount: number;
  setWalletCount: (walletCount: number) => void;
};

export const SetValidators = ({
  wallets,
  setWallets,
  walletCount,
  setWalletCount,
}: SetValidatorsProps) => {
  const { register, setValue, formState } = useFormContext();
  const { errors } = formState;

  const handleAddValidator = () => {
    const newWallet = getRandomWallet();
    setValue(`addresses.${walletCount}`, newWallet.address);
    setWalletCount(walletCount + 1);
    setWallets([...wallets, newWallet]);
  };

  // @ts-expect-error - react-hook-form doesn't handle the array properly
  const addressErrors = errors.addresses as { message: string }[];

  return (
    <div>
      <label className="font-bold">Validators</label>
      <div className="mx-1 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {wallets.slice(0, 8).map((wallet, index) => (
            <div key={wallet.address + index}>
              <input
                type="text"
                placeholder={`Validator Address ${index + 1}`}
                className={twJoin(
                  'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input',
                  index === 0 && 'cursor-not-allowed bg-gray-200 opacity-50',
                )}
                readOnly={index === 0}
                {...register(`addresses.${index}`)}
              />
              {addressErrors?.[index] && (
                <p className="text-sm text-red-500">{String(addressErrors[index]?.message)}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {wallets.slice(8, 16).map((wallet, index) => (
            <div key={wallet.address + index}>
              <input
                type="text"
                placeholder={`Validator ${index + 9}`}
                className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
                {...register(`addresses.${index + 8}`)}
              />
              {addressErrors?.[index + 8] && (
                <p className="text-sm text-red-500">{String(addressErrors[index + 8]?.message)}</p>
              )}
            </div>
          ))}
        </div>
        <span className="cursor-pointer text-xs hover:underline" onClick={handleAddValidator}>
          <i className="pi pi-plus-circle mr-1 text-xs" />
          Add Validator
        </span>
      </div>
    </div>
  );
};
