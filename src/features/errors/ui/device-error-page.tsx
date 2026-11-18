import { SadMonitorIllustration } from "./sad-monitor-illustration";

export function DeviceErrorPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background px-6 py-10 text-center">
      <SadMonitorIllustration className="mb-7" />

      <h1 className="mb-4 text-4xl font-normal tracking-tight text-foreground">
        Oops
      </h1>

      <p className="max-w-sm text-base leading-relaxed text-text-secondary sm:max-w-md">
        This app isn’t supported on mobile devices.
        <br />
        Please open it on a desktop or tablet to continue.
      </p>
    </main>
  );
}
