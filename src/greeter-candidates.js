let CANDIDATES = [];

export function get() {
  return CANDIDATES;
}

export function $reset_candidates() {
  CANDIDATES = [
    {
      tag: 'hermit',
      val: {
        name: 'Oliver',
      },
    },
    {
      tag: 'hermit',
      val: {
        name: 'Violet',
        legoCount: 100,
      },
    },
    {
      tag: 'excited',
      val: {
        name: 'Charlotte',
      },
    },
    {
      tag: 'excited',
      val: {
        name: 'Theodore',
        legoCount: 200,
      },
    },
  ];
  return {
    saying: 'Hello, Theodore!',
    legoCount: 200,
  };
}
