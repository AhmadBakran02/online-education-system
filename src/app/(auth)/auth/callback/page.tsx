export default async function GoogleLogin({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; name?: string }>;
}) {
  const { token } = await searchParams;
  const { name } = await searchParams;
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>token: {token}</p>
    </div>
  );
}
