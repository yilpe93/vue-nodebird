export const state = () => ({
  me: null, // 로그인 상태,
  followingList: [],
  followerList: [],
  hasMoreFollowing: true,
  hasMoreFollower: true,
});

const totalFollowings = 6;
const totalFollowers = 8;
const limit = 3;

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
  LOAD_MORE_FOLLOWINGS(state) {
    const diff = totalFollowings - state.followingList.length;
    const fakeUsers = Array(diff > limit ? limit : diff)
      .fill()
      .map((v) => ({
        id: Math.random().toString(),
        nickname: Math.floor(Math.random() * 1000),
      }));

    state.followingList = state.followingList.concat(fakeUsers);
    state.hasMoreFollowing = fakeUsers.length === limit;
  },
  LOAD_MORE_FOLLOWERS(state) {
    const diff = totalFollowers - state.followerList.length;
    const fakeUsers = Array(diff > limit ? limit : diff)
      .fill()
      .map((v) => ({
        id: Math.random().toString(),
        nickname: Math.floor(Math.random() * 1000),
      }));

    state.followerList = state.followerList.concat(fakeUsers);
    state.hasMoreFollower = fakeUsers.length === limit;
  },
};

// 비동기적 작업
export const actions = {
  // const { commit, dispatch, state, rootState, getters } = context
  signUp({ commit }, payload) {
    this.$axios.post("http://localhost:3085/user/resigter", {
      email: payload.email,
      nickname: payload.nickname,
      password: payload.password,
    });

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
  loadFollowing({ commit, state }, payload) {
    if (state.hasMoreFollowing) {
      commit("LOAD_MORE_FOLLOWINGS");
    }
  },
  loadFollower({ commit, state }, payload) {
    if (state.hasMoreFollower) {
      commit("LOAD_MORE_FOLLOWERS");
    }
  },
};
