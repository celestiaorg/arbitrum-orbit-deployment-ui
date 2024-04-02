import { PublicClient, WalletClient, Address, zeroAddress } from 'viem';
import {
  prepareChainConfig,
  prepareNodeConfig,
  CoreContracts,
  createRollupEnoughCustomFeeTokenAllowance,
  createRollupPrepareCustomFeeTokenApprovalTransactionRequest,
  createRollupPrepareTransactionRequest,
  createRollupPrepareTransactionReceipt,
  CelestiaConfig
} from 'celestia-orbit-sdk';

import { ChainType } from '@/types/ChainType';
import { Wallet } from '@/types/RollupContracts';
import { RollupConfig } from '@/types/rollupConfigDataType';
import { buildL3Config, buildRollupConfigPayload } from './configBuilders';
import { updateLocalStorage } from './localStorageHandler';
import { assertIsAddress, assertIsAddressArray } from './validators';
import { ChainId } from '@/types/ChainId';
import { getRpcUrl } from './getRpcUrl';

type DeployRollupProps = {
  rollupConfig: RollupConfig;
  validators: Wallet[];
  batchPoster: Wallet;
  publicClient: PublicClient;
  walletClient: WalletClient;
  chainType?: ChainType;
  account: Address;
  celestiaConfig?: CelestiaConfig;
};


export async function deployRollup({
  rollupConfig,
  validators,
  batchPoster,
  publicClient,
  walletClient,
  account,
  chainType = ChainType.Rollup,
  celestiaConfig,
}: DeployRollupProps): Promise<CoreContracts> {
  try {
    assertIsAddress(rollupConfig.owner);
    console.log("Sending deployment tx");
    const chainConfig = prepareChainConfig({
      chainId: rollupConfig.chainId,
      arbitrum: {
        InitialChainOwner: rollupConfig.owner,
        DataAvailabilityCommittee: chainType === ChainType.AnyTrust,
        CelestiaDA: chainType === ChainType.CelestiaDA,
      },
    });
    const rollupConfigPayload = buildRollupConfigPayload({ rollupConfig, chainConfig });

    const validatorAddresses = validators.map((v) => v.address);
    const batchPosterAddress = batchPoster.address;
    const nativeToken = rollupConfig.nativeToken;

    // custom gas token
    if (nativeToken !== zeroAddress) {
      // check if enough allowance on rollup creator for custom gas token
      const enoughAllowance = await createRollupEnoughCustomFeeTokenAllowance({
        nativeToken: nativeToken as Address,
        account: walletClient.account?.address!,
        publicClient,
      });

      if (!enoughAllowance) {
        // if not, create tx to approve tokens to be spent
        const txRequest = await createRollupPrepareCustomFeeTokenApprovalTransactionRequest({
          nativeToken: nativeToken as Address,
          account: walletClient.account?.address!,
          publicClient,
        });

        // submit and wait for tx to be confirmed
        await publicClient.waitForTransactionReceipt({
          hash: await walletClient.sendTransaction(txRequest),
        });
      }
    }

    console.log(chainConfig);
    console.log('Going for deployment');

    const parentChainId: ChainId = await publicClient.getChainId();

    assertIsAddress(batchPosterAddress);
    assertIsAddress(nativeToken);
    assertIsAddressArray(validatorAddresses);

    const txRequest = await createRollupPrepareTransactionRequest({
      params: {
        config: rollupConfigPayload,
        batchPosters: [batchPosterAddress],
        batchPosterManager: rollupConfig.owner, // defaulting to the same address as the batch poster
        validators: validatorAddresses,
        nativeToken,
      },
      account: walletClient.account?.address!,
      publicClient,
    });

    const txReceipt = createRollupPrepareTransactionReceipt(
      await publicClient.waitForTransactionReceipt({
        hash: await walletClient.sendTransaction(txRequest),
      }),
    );

    const coreContracts = txReceipt.getCoreContracts();

    const nodeConfig = prepareNodeConfig({
      chainName: rollupConfig.chainName,
      chainConfig,
      coreContracts,
      batchPosterPrivateKey: batchPoster.privateKey || '',
      validatorPrivateKey: validators[0].privateKey || '',
      parentChainId,
      parentChainRpcUrl: getRpcUrl(parentChainId),
      celestiaConfig: chainType === ChainType.CelestiaDA ? {
        enable: true,
        is_poster: true,
        rpc: 'http://localhost:26658',
        tendermint_rpc: 'rpc.celestia-mocha.com',
        eth_rpc: '',
        namespace_id: '000008e5f679bf7116cb',
        gas_price: 0.1,
        auth_token: '',
        event_channel_size: 100,
        blobstreamx_address: '0xc3e209eb245Fd59c8586777b499d6A665DF3ABD2'
      } : undefined
    });

    // Defining L3 config
    const l3Config = await buildL3Config({
      address: account,
      rollupConfig,
      coreContracts,
      validators,
      batchPoster,
      parentChainId,
    });

    updateLocalStorage(nodeConfig, l3Config);

    return coreContracts;
  } catch (e) {
    throw new Error(`Failed to deploy rollup: ${e}`);
  }
}
