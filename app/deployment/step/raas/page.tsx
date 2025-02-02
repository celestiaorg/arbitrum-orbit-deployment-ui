import { RaasProviderCard } from '@/components/RaasProviderCard';
import { StepTitle } from '@/components/StepTitle';

export default function RaasProvidersPage() {
  return (
    <div className="rounded-md border glass-effect-dark p-8">
      <div className="flex flex-col gap-6">
        <StepTitle>Rollup-as-a-Service Providers</StepTitle>
        <p className="text-sm font-light">
          As an optional next step, if you’d like to deploy to mainnet , we suggest using a
          Rollup-as-a-Service Provider. They have the context and experience to help with deploying
          contracts, protocol modifications, and maintaining infrastructure.
        </p>
        {/* TODO: reactivate when page is ready */}
        {/* <button className={twMerge(` w-36 rounded-sm bg-white p-2 text-lg text-black`)}>
          Get in touch
        </button> */}
        <h3 className="text-2xl font-light">Lean about the Providers</h3>
        {/* TODO: swap to 3 columns when adding 5th RaaS Provider */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <RaasProviderCard
            name="Caldera"
            description="Supports AnyTrust and Rollup chains"
            caption="Powering Treasure, Hychain, Rari"
            link="https://caldera.xyz/"
            logo="/Caldera.svg"
          />
          <RaasProviderCard
            name="Conduit"
            description="Supports AnyTrust and Rollup chains"
            caption="Powering Frame, Orb3, and Parallel"
            link="https://conduit.xyz/"
            logo="/Conduit.svg"
          />
          <RaasProviderCard
            name="AltLayer"
            description="Supports AnyTrust chains"
            caption="Powering Cometh, Polychain Monster & Avive"
            link="https://altlayer.io/"
            logo="/AltLayer.svg"
          />
          <RaasProviderCard
            name="Gelato"
            description="Supports AnyTrust chains"
            caption="Powering re.al and Playnance"
            link="https://gelato.network/"
            logo="/Gelato.svg"
          />
        </div>
      </div>
    </div>
  );
}
