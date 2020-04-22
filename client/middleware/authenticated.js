// 로그인 했는지
export default function ({ store, redirect }) {
  if (store.state.users.me) {
    redirect("/");
  }
}
