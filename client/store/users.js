export const state = () => ({
  me: null, // 로그인 상태,
  followingList: ["킴재쿤1", "네로1", "히로1"],
  followerList: ["킴재쿤2", "네로2", "히로2"],
});

// 동기적 작업
export const mutations = {
  SET_ME(state, payload) {
    state.me = payload;
  },
  CHANGE_NICKNAME(state, payload) {
    state.me.nickname = payload.nickname;
  },
  REMOVE_FOLLOWING(state, payload) {
    state.followingList.splice(payload, 1);
  },
  REMOVE_FOLLOWER(state, payload) {
    state.followerList.splice(payload, 1);
  },
};

// 비동기적 작업
export const actions = {
  // { commit, dispatch, state, rootState, getters } = context
  signUp({ commit }, payload) {
    // 서버에 회원가입 요청을 보내는 부분
    commit("SET_ME", payload);
  },
  logIn({ commit, getters }, payload) {
    commit("SET_ME", payload);
    getters.getMe;
  },
  logOut({ commit }) {
    commit("SET_ME", null);
  },
  changeNickname({ commit }, payload) {
    commit("CHANGE_NICKNAME", payload);
  },
  removeFollowing({ commit }, payload) {
    commit("REMOVE_FOLLOWING", payload);
  },
  removeFollower({ commit }, payload) {
    commit("REMOVE_FOLLOWER", payload);
  },
};
