# Redux example

    private store = inject(Store);

---

    public loadingState = this.store.selectSignal(selectLoading);

    constructor() {
      effect(() => {
        const loading = this.loadingState();

        console.log("Is loading: " + loading);
      });
    }

    public state = computed(() => {
      const loading = this.loadingState();

      return `Is loading: ${loading ? 'yes' : 'no'}`;
    });


----

    public setLoading() {
      this.store.dispatch(accumulationTanksActions.setLoading({ loading: true }));
    }