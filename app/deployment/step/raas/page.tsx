import { RaasProviderCard } from '@/components/RaasProviderCard';
import { StepTitle } from '@/components/StepTitle';
import { twMerge } from 'tailwind-merge';

export default function RaasProvidersPage() {
  return (
    <div className="rounded-md border border-solid border-grey p-8">
      <div className="flex flex-col gap-6">
        <StepTitle>Rollup-as-a-Service Providers</StepTitle>
        <p className="text-sm font-light">
          As an optional next step, if you’d like to deploy to mainnet , we suggest using a
          Rollup-as-a-Service Provider. They have the context and experience to help with deploying
          contracts, protocol modifications, and maintaining infrastructure.
        </p>
        <button className={twMerge(` w-36 rounded-sm bg-white p-2 text-lg text-black`)}>
          Get in touch
        </button>
        <h3 className="text-2xl font-light">Lean about the Providers</h3>
        <div className="flex flex-wrap gap-8">
          <RaasProviderCard
            name="Caldera"
            description="Supports AnyTrust and Rollup chains"
            link="https://caldera.xyz/"
            logo="/Caldera.svg"
          />
          <RaasProviderCard
            name="Conduit"
            description="Supports AnyTrust and Rollup chains"
            link="https://conduit.xyz/"
            logo="/Conduit.svg"
          />
          <RaasProviderCard
            name="AltLayer"
            description="Supports AnyTrust and Rollup chains"
            link="https://altlayer.io/"
            logo="/AltLayer.svg"
          />
        </div>
      </div>
    </div>
  );
}
