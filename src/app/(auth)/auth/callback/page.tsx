import Cookies from "js-cookie";

export default async function GoogleLogin({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (token) Cookies.set("token", token);

  return (
    <div>
      <p>wait please...</p>
    </div>
  );
}
