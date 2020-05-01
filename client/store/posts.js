export const state = () => ({
  mainPosts: [],
  hasMorePost: true,
  imagePaths: [],
});

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
    state.imagePaths = [];
  },
  REMOVE_MAIN_POST(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.postId);
    state.mainPosts.splice(index, 1);
  },
  LOAD_COMMENTS(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.postId);
    state.mainPosts[index].Comments = payload;
  },
  ADD_COMMENT(state, payload) {
    const index = state.mainPosts.findIndex((v) => v.id === payload.postId);
    state.mainPosts[index].Comments.unshift(payload);
  },
  LOAD_POSTS(state, payload) {
    state.mainPosts = state.mainPosts.concat(payload);
    state.hasMorePost = payload.length !== limit;
  },
  CONCAT_IMAGE_PATHS(state, payload) {
    console.log("payload", payload);
    state.imagePaths = state.imagePaths.concat(payload);
  },
  REMOVE_IMAGE_PATHS(state, payload) {
    state.imagePaths.splice(payload, 1);
  },
};

export const actions = {
  addPost({ commit, state }, payload) {
    const { content } = payload;
    const { imagePaths } = state;

    console.log(content, imagePaths);

    this.$axios
      .post(
        "http://localhost:3085/post",
        {
          content,
          image: imagePaths,
          // content: payload.content,
          // imagePaths: state.imagePaths
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.time();
        commit("ADD_MAIN_POST", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  removePost({ commit }, payload) {
    this.$axios
      .delete(`http://localhst:3085/post/${payload.postId}`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("REMOVE_MAIN_POST", payload);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  loadComment({ commit, payload }) {
    const { postId } = payload;
    this.$axios
      .get(`http://localhost:3085/post/${postId}/comments`)
      .then((res) => {
        commit("LOAD_COMMENTS", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  addComment({ commit }, payload) {
    const { content, postId } = payload;
    this.$axios
      .post(
        `http://localhost:3085/post/${postId}/comment`,
        {
          content,
        },
        { withCredentials: true }
      )
      .then((res) => {
        commit("ADD_COMMENT", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  loadPosts({ commit, state }, payload) {
    if (state.hasMorePost) {
      this.$axios
        .get(
          `http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=10`
        )
        .then((res) => {
          commit("LOAD_POSTS", res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  uploadImages({ commit }, payload) {
    this.$axios
      .post("http://localhost:3085/post/images", payload, {
        withCredentials: true,
      })
      .then((res) => {
        commit("CONCAT_IMAGE_PATHS", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
