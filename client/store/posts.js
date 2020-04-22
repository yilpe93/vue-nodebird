export const state = () => ({
  mainPosts: [],
});

export const mutations = {
  ADD_MAIN_POST(state, payload) {
    state.mainPosts.unshift(payload);
    console.log("add", state.mainPosts);
  },
  REMOVE_MAIN_POST(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.id);
    state.mainPosts.splice(index, 1);
    console.log("remove", state.mainPosts);
  },
  ADD_COMMENT(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.postId);
    state.mainPosts[index].Comments.unshift(payload);
    console.log("add_comment", state.mainPosts);
  },
};

export const actions = {
  addPost({ commit }, payload) {
    commit("ADD_MAIN_POST", payload);
  },
  removePost({ commit }, payload) {
    commit("REMOVE_MAIN_POST", payload);
  },
  addComment({ commit }, payload) {
    commit("ADD_COMMENT", payload);
  },
};

/* 
  # root, default false
  { root: true }
  store/index.js 참조할 수 있다.
*/

/* 
  this.$store.state.posts.name;
  this.$store.commit("posts/BYE");
*/
