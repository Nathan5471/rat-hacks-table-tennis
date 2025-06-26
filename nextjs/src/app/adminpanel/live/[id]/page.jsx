export default async function Live({ params }) {
  const { id } = await params;
  return <>{id}</>;
}
