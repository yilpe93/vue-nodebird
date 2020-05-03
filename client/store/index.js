export const state = () => ({});

export const mutations = {};

export const actions = {
  async nuxtServerInit({ commit, dispatch, state }, { req }) {
    await dispatch("users/loadUser");
  },
};
