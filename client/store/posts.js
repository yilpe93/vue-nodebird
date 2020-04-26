export const state = () => ({
  mainPosts: [],
  hasMorePost: true,
});

// 실무적으로는 lastId 기반을 통해서 불러온다.
// totalPosts 가정
const totalPosts = 51;
const limit = 10;

/* 
  # [Module] vue-virtual-scroll-list (https://codespots.com/library/item/650#using-by-npm-module)
  
  - 직접 구현이 어려울 뿐더러, 최적화 작업 필요
  - 화면에 보이는 일관성있는 높이를 알아야 한다.
*/

/* 
  # Infinite Scrolling 가정
  1. 프론트에서는 전체 posts의 갯수를 모른다.
  2. `hasMorePost = ture` Default 정의 후, LoadPosts와 함께 스크롤됨에 따라 limit에 따른 posts 갯수를 요청한다.
  3. limit = 10 이라 가정했을 때, 불러오는 갯수가 limit === payload.length; 와 같은지 체크
  4. 같지 않다면 hasMorePost = false; 와 함께 더이상 API 호출을 하지 않도록 한다.
*/

export const mutations = {
  ADD_MAIN_POST(state, payload) {
    state.mainPosts.unshift(payload);
    console.log("add", state.mainPosts);
  },
  REMOVE_MAIN_POST(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.id);
    state.mainPosts.splice(index, 1);
  },
  ADD_COMMENT(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.postId);
    state.mainPosts[index].Comments.unshift(payload);
  },
  LOAD_POSTS(state) {
    const diff = totalPosts - state.mainPosts.length; // 아직 안 불러온 게시글 수
    const fakePosts = Array(diff > limit ? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      User: {
        id: 1,
        nickname: '킴재쿤'
      },
      content: `Hello, Infinite scrolling~ ${Math.random()}`,
      Comments: [],
      Images: []
    }));

    state.mainPosts = state.mainPosts.concat(fakePosts);
    state.hasMorePost = fakePosts.length !== limit;
  }
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
  loadPosts({ commit, state }, payload) {
    if (state.hasMorePost) {
      commit('LOAD_POSTS')
    }
  }
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
