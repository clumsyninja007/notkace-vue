// vuex 4 augments ComponentCustomOptions but never declares $store on the
// component instance, so templates using $store don't type-check. Vuex's own
// docs expect each app to declare it; the store is loosely typed here to match
// how it's written in src/store/index.ts.
import type { Store } from 'vuex';

declare module 'vue' {
  interface ComponentCustomProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $store: Store<any>;
  }
}

export {};
