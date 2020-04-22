export const state = () => ({
  me: null, // 로그인 상태,
  followingList: [
    { id: 1, nickname: "킴재쿤" },
    { id: 2, nickname: "네로" },
    { id: 3, nickname: "히로" },
  ],
  followerList: [
    { id: 1, nickname: "킴재쿤" },
    { id: 2, nickname: "네로" },
    { id: 3, nickname: "히로" },
  ],
});

// 동기적 작업
export const mutations = {
  SET_ME(state, payload) {
    state.me = payload;
  },
  CHANGE_NICKNAME(state, payload) {
    state.me.nickname = payload.nickname;
  },
  ADD_FOLLOWING(state, payload) {
    state.followingList.push(payload);
  },
  ADD_FOLLOWER(state, payload) {
    state.followerList.push(payload);
  },
  REMOVE_FOLLOWING(state, id) {
    const index = state.followingList.findIndex((list) => list.id === id);
    state.followingList.splice(index, 1);
  },
  REMOVE_FOLLOWER(state, id) {
    const index = state.followerList.findIndex((list) => list.id === id);
    state.followerList.splice(index, 1);
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
  addFollowing({ commit }, payload) {
    commit("ADD_FOLLOWING", payload);
  },
  addFollwer({ commit }, payload) {
    commit("ADD_FOLLOWER", payload);
  },
  removeFollowing({ commit }, payload) {
    commit("REMOVE_FOLLOWING", payload);
  },
  removeFollower({ commit }, payload) {
    commit("REMOVE_FOLLOWER", payload);
  },
};
