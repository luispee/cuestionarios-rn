// This function is web-only as native doesn't currently support server (or build-time) rendering.Add commentMore actions


export function useClientOnlyValue<S, C>(server: S, client: C): S | C {


  return client;


}