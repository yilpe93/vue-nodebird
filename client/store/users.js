export const state = () => ({
  me: null, // 로그인 상태,
  followingList: [],
  followerList: [],
  hasMoreFollowing: true,
  hasMoreFollower: true,
  ohter: null, // 남의 정보
});

// withCredentials: true => cols로 인한 Local에서 쿠키가 처리될 수 있도록

// 동기적 작업
export const mutations = {
  SET_ME(state, payload) {
    state.me = payload;
  },
  SET_OTHER(state, payload) {
    state.me.nickname = payload.nickname;
  },
  CHANGE_NICKNAME(state, payload) {
    state.me.nickname = payload.nickname;
  },
  ADD_FOLLOWING(state, payload) {
    state.followingList.push(payload);
  },
  REMOVE_FOLLOWING(state, payload) {
    let index = state.me.Followings.findIndex(
      (list) => list.id === payload.userId
    );
    state.me.Followings.splice(index, 1);
    index = state.followerList.findIndex((v) => v.id === payload.id);
    state.followingList.splice(index, 1);
  },
  ADD_FOLLOWER(state, payload) {
    state.followerList.push(payload);
  },
  REMOVE_FOLLOWER(state, payload) {
    let index = state.me.Followers.findIndex(
      (list) => list.id === payload.userId
    );
    state.me.Followers.splice(index, 1);
    index = state.followerList.findIndex((v) => v.id === payload.id);
    state.followerList.splice(index, 1);
  },
  LOAD_MORE_FOLLOWINGS(state, payload) {
    if (payload.offset === 0) {
      state.followingList = payload.data;
    } else {
      state.followingList = state.followingList.concat(payload.data);
    }

    state.hasMoreFollowing = payload.data.length === payload.limit;
  },
  LOAD_MORE_FOLLOWERS(state, payload) {
    if (payload.offset === 0) {
      state.followerList = payload.data;
    } else {
      state.followerList = state.followerList.concat(payload.data);
    }

    state.hasMoreFollower = payload.data.length === payload.limit;
  },
  FOLLOWING(state, payload) {
    state.me.Followings.push({ id: payload.userId });
  },
};

// 비동기적 작업
export const actions = {
  // const { commit, dispatch, state, rootState, getters } = context
  async loadUser({ commit }) {
    try {
      const res = await this.$axios.get(
        "/user",
        {},
        {
          withCredentials: true,
        }
      );
      commit("SET_ME", res.data);
    } catch (err) {
      console.error(err);
    }
  },
  async loadOther({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/user/${payload.userId}`, {
        withCredentials: true,
      });
      commit("SET_OTHER", res.data);
    } catch (err) {
      console.error(err);
    }
  },
  signUp({ commit }, payload) {
    const { email, nickname, password } = payload;
    return this.$axios
      .post(
        "/user",
        {
          email,
          nickname,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        commit("SET_ME", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  logIn({ commit }, payload) {
    const { email, password } = payload;

    return this.$axios
      .post("/user/login", { email, password }, { withCredentials: true })
      .then((res) => {
        commit("SET_ME", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  logOut({ commit }) {
    return this.$axios
      .post("/user/logout", {}, { withCredentials: true })
      .then((res) => {
        commit("SET_ME", null);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  changeNickname({ commit }, payload) {
    this.$axios
      .patch(
        `/user/nickname`,
        { nickname: payload.nickname },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        commit("CHANGE_NICKNAME", payload);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  addFollowing({ commit }, payload) {
    commit("ADD_FOLLOWING", payload);
  },
  addFollwer({ commit }, payload) {
    commit("ADD_FOLLOWER", payload);
  },
  loadFollowings({ commit, state }, payload) {
    if (!(payload && payload.offset === 0) && !state.hasMoreFollowing) {
      return;
    }

    const offset =
      payload && payload.offset === 0 ? 0 : state.followingList.length;

    return this.$axios
      .get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("LOAD_MORE_FOLLOWINGS", {
          data: res.data,
          offset,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  loadFollowers({ commit, state }, payload) {
    if (!(payload && payload.offset === 0) && !state.hasMoreFollower) {
      return;
    }

    const offset =
      payload && payload.offset === 0 ? 0 : state.followerList.length;

    return this.$axios
      .get(`/user/${state.me.id}/followers?limit=3&offset=${offset}`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("LOAD_MORE_FOLLOWERS", {
          data: res.data,
          offset,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  follow({ commit }, payload) {
    return this.$axios
      .post(`/user/${payload.userId}/follow`, {}, { withCredentials: true })
      .then((res) => {
        commit("FOLLOWING", {
          userId: payload.userId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  unFollow({ commit }, payload) {
    return this.$axios
      .delete(`/user/${payload.userId}/follow`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("REMOVE_FOLLOWING", {
          userId: payload.userId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  removeFollower({ commit }, payload) {
    return this.$axios
      .delete(`/user/${payload.userId}/follower`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("REMOVE_FOLLOWER", {
          userId: payload.userId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
