import { lazy, Suspense, type ComponentType } from "react";

type LoadedComponent<P extends object> =
  | ComponentType<P>
  | { default: ComponentType<P> };

export default function dynamic<P extends object = Record<string, never>>(
  loader: () => Promise<LoadedComponent<P>>,
  options: { loading?: ComponentType; ssr?: boolean } = {},
) {
  const LazyComponent = lazy(async () => {
    const result = await loader();
    return { default: "default" in result ? result.default : result };
  });
  const Loading = options.loading;
  return function DynamicComponent(props: P) {
    return (
      <Suspense fallback={Loading ? <Loading /> : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
