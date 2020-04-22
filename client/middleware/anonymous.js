// 로그인 안했는지
export default function ({ store, redirect }) {
  if (!store.state.users.me) {
    redirect("/");
  }
}
